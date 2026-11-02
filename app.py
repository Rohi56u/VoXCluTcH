from __future__ import annotations
import os
import re
import time
import uuid
import hmac
from datetime import datetime, timezone
from pathlib import Path
from threading import RLock
from urllib.parse import urlsplit
from flask import Flask, Response, jsonify, render_template, request, send_file
from werkzeug.utils import secure_filename
from werkzeug.middleware.proxy_fix import ProxyFix
from voxclutch.clips import ALLOWED_VIDEO_SUFFIXES, export_clip
from voxclutch.echomap import analyze_audio_levels, enrich_moments
from voxclutch.scoring import MomentDetector
from voxclutch.store import MomentStore
from voxclutch.twitch_chat import TwitchChatListener

ROOT = Path(__file__).resolve().parent
DATA = Path(os.environ.get('VOXCLUTCH_DATA_DIR', ROOT / 'data')).resolve()
UPLOADS = (ROOT / 'uploads').resolve()
EXPORTS = (ROOT / 'exports').resolve()
DB_PATH = DATA / 'voxclutch.sqlite3'


def create_app(test_config=None):
    app = Flask(__name__)
    app.config.update(MAX_CONTENT_LENGTH=500 * 1024 * 1024, TESTING=False)
    if test_config: app.config.update(test_config)
    preview_mode = os.environ.get('VOXCLUTCH_ALLOW_REMOTE', '').lower() == '1'
    app.config['REMOTE_PREVIEW'] = preview_mode
    preview_user = os.environ.get('VOXCLUTCH_PREVIEW_USER', 'tester')
    preview_password = os.environ.get('VOXCLUTCH_PREVIEW_PASSWORD', '')
    if preview_mode and not preview_password:
        raise RuntimeError('Remote preview requires VOXCLUTCH_PREVIEW_PASSWORD.')
    if preview_mode:
        app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1)
    store = MomentStore(app.config.get('DATABASE', DB_PATH))
    detector = MomentDetector()
    state_lock = RLock()
    state = {'status': 'idle', 'message': 'Demo mode ready', 'channel': None, 'started_at': None, 'source_video': None, 'audio_analysis': None, 'last_event_at': None, 'messages_seen': 0, 'last_candidate_at': 0.0}

    def status_update(code, message):
        with state_lock:
            state['status'], state['message'] = code, message

    def handle_event(event):
        with state_lock:
            state['messages_seen'] += 1
            state['last_event_at'] = event['at']
            started_at = state['started_at']
        result = detector.ingest(event['user'], event['text'], event['at'], event['id'])
        now_epoch = time.time()
        with state_lock:
            if not result or now_epoch - state['last_candidate_at'] < 30:
                return
            state['last_candidate_at'] = now_epoch
        try:
            start_dt = datetime.fromisoformat(result['window_start'])
            start_sec = max(0.0, (start_dt - datetime.fromisoformat(started_at)).total_seconds()) if started_at else 0.0
            end_sec = start_sec + result['signals']['window_seconds']
            store.create_moment(created_at=datetime.now(timezone.utc).isoformat(), start_seconds=start_sec, end_seconds=end_sec, score=result['score'], signals=result['signals'], source=event.get('source', 'live'))
        except (TypeError, ValueError):
            app.logger.exception('Could not persist a detected moment')

    listener = TwitchChatListener(handle_event, status_update)
    app.extensions['voxclutch_store'] = store
    app.extensions['voxclutch_listener'] = listener
    app.extensions['voxclutch_state'] = state
    app.extensions['voxclutch_detector'] = detector

    @app.before_request
    def local_only_guard():
        # Default is loopback-only. Remote preview is explicit and Basic-authenticated.
        remote = request.remote_addr or ''
        is_loopback = remote in {'127.0.0.1', '::1'}
        if preview_mode:
            auth = request.authorization
            valid_user = auth is not None and hmac.compare_digest(auth.username or '', preview_user)
            valid_password = auth is not None and hmac.compare_digest(auth.password or '', preview_password)
            if not (valid_user and valid_password):
                return Response('VoxClutch preview login required.', 401, {'WWW-Authenticate': 'Basic realm="VoxClutch test preview", charset="UTF-8"', 'Cache-Control': 'no-store'})
        elif not app.testing and not is_loopback:
            return jsonify(error='VoxClutch is local-only. Do not expose this development server to a network.'), 403
        host = (urlsplit('//' + request.host).hostname or '').lower()
        local_host = host in {'127.0.0.1', 'localhost', '::1'}
        preview_host = preview_mode and host.endswith('.sg2.manus.computer')
        if not (local_host or preview_host):
            return jsonify(error='Unrecognized Host header.'), 400
        origin = request.headers.get('Origin')
        if origin:
            parsed_origin = urlsplit(origin)
            origin_host = (parsed_origin.hostname or '').lower()
            forwarded_scheme = request.headers.get('X-Forwarded-Proto', request.scheme).split(',')[0].strip().lower()
            origin_port = parsed_origin.port or (443 if parsed_origin.scheme == 'https' else 80)
            request_port = urlsplit('//' + request.host).port or (443 if forwarded_scheme == 'https' else 80)
            origin_allowed = local_host or preview_host
            if parsed_origin.scheme != forwarded_scheme or origin_host != host or not origin_allowed or origin_port != request_port:
                return jsonify(error='Cross-origin requests are not allowed.'), 403

    @app.after_request
    def preview_cache_headers(response):
        if preview_mode:
            response.headers['Cache-Control'] = 'private, no-store'
            response.headers['Referrer-Policy'] = 'no-referrer'
        return response

    @app.get('/')
    def home(): return render_template('index.html', remote_preview=preview_mode)

    @app.get('/api/status')
    def api_status():
        with state_lock: data = dict(state)
        data['listener_running'] = listener.running
        data['uptime_seconds'] = max(0, int(time.time() - data['started_epoch'])) if data.get('started_epoch') else 0
        data.pop('started_epoch', None)
        data['moments_count'] = len(store.list_moments(250))
        return jsonify(data)

    @app.get('/api/moments')
    def api_moments():
        with state_lock: audio=state.get('audio_analysis')
        moments=store.list_moments()
        if audio:
            moments=enrich_moments(moments,audio['levels_db'],audio['source_offset_seconds'])
        return jsonify(moments=moments)

    @app.post('/api/connect')
    def api_connect():
        body = request.get_json(silent=True) or {}
        channel = str(body.get('channel', '')).strip().lstrip('#').lower()
        if not re.fullmatch(r'[a-z0-9_]{1,25}', channel):
            return jsonify(error='Enter a valid Twitch channel login (letters, numbers, underscore; max 25).'), 400
        now = datetime.now(timezone.utc).isoformat()
        with state_lock:
            state.update(channel=channel, status='connecting', message=f'Connecting to #{channel}…', started_at=now, started_epoch=time.time(), messages_seen=0, last_candidate_at=0)
        detector.reset()
        try: listener.start(channel)
        except ValueError as exc: return jsonify(error=str(exc)), 400
        return jsonify(ok=True, channel=channel)

    @app.post('/api/disconnect')
    def api_disconnect():
        listener.stop()
        with state_lock: state.update(status='idle', message='Listener stopped', channel=None, started_at=None, started_epoch=None)
        detector.reset()
        return jsonify(ok=True)

    @app.post('/api/demo')
    def api_demo():
        listener.stop(); detector.reset()
        now = datetime.now(timezone.utc)
        with state_lock:
            state.update(status='demo', message='Synthetic reaction burst injected', channel='demo_channel', started_at=now.isoformat(), started_epoch=time.time(), messages_seen=0, last_candidate_at=0)
        # Synthetic data is clearly labelled; no Twitch connection or user content involved.
        phrases = ['Poggers! That was unreal', 'letsgo clutch!', 'GG wow', 'Kekw', 'INSANE play', 'Pog!', 'clutch moment', 'LMAO']
        for index, text in enumerate(phrases):
            handle_event({'user': f'demo_viewer_{index % 6}', 'text': text, 'at': now.isoformat(), 'id': f'demo-{uuid.uuid4().hex}', 'source': 'demo'})
        return jsonify(ok=True)

    @app.post('/api/moments/<ident>/review')
    def api_review(ident):
        body = request.get_json(silent=True) or {}
        status = body.get('status')
        try: moment = store.update_status(ident, status)
        except ValueError as exc: return jsonify(error=str(exc)), 400
        return (jsonify(moment=moment), 200) if moment else (jsonify(error='Moment not found'), 404)

    @app.post('/api/video')
    def api_video_upload():
        item = request.files.get('video')
        if not item or not item.filename: return jsonify(error='Choose a video file first.'), 400
        name = secure_filename(item.filename)
        suffix = Path(name).suffix.lower()
        if suffix not in ALLOWED_VIDEO_SUFFIXES: return jsonify(error='Supported: MP4, MOV, MKV, WebM.'), 400
        UPLOADS.mkdir(parents=True, exist_ok=True)
        target = UPLOADS / f'{uuid.uuid4().hex}{suffix}'
        item.save(target)
        with state_lock:
            previous=state.get('source_video')
            state['source_video'] = target.name
            state['audio_analysis'] = None
        if previous and previous!=target.name:
            old_source=(UPLOADS/previous).resolve()
            if old_source.parent==UPLOADS.resolve(): old_source.unlink(missing_ok=True)
        return jsonify(ok=True, filename=name, size_bytes=target.stat().st_size)

    @app.delete('/api/video')
    def api_video_delete():
        with state_lock:
            filename=state.get('source_video')
            state['source_video']=None
            state['audio_analysis']=None
        if filename:
            source=(UPLOADS/filename).resolve()
            if source.parent==UPLOADS.resolve(): source.unlink(missing_ok=True)
        return jsonify(ok=True,message='Uploaded VOD and its in-memory EchoMap analysis were removed.')

    @app.post('/api/audio/analyze')
    def api_audio_analyze():
        body=request.get_json(silent=True) or {}
        try:
            offset=float(body.get('source_offset_seconds',0))
            if not 0<=offset<=24*3600: raise ValueError('VOD offset must be between 0 and 86400 seconds.')
        except (TypeError,ValueError) as exc:
            return jsonify(error=str(exc)),400
        with state_lock: filename=state.get('source_video')
        if not filename: return jsonify(error='Upload a VOD before running EchoMap.'),400
        source=(UPLOADS/filename).resolve()
        if source.parent!=UPLOADS.resolve() or not source.is_file(): return jsonify(error='Uploaded source is unavailable.'),400
        try:
            levels=analyze_audio_levels(source)
            if not levels: return jsonify(error='No audio samples were found in this VOD.'),400
            with state_lock:
                if state.get('source_video')!=filename:
                    return jsonify(error='The VOD changed during analysis. Please run EchoMap again.'),409
                state['audio_analysis']={'filename':filename,'levels_db':levels,'source_offset_seconds':offset}
            return jsonify(ok=True,duration_seconds=len(levels),moments_analyzed=len(store.list_moments()),message='EchoMap audio analysis complete. Raw audio was processed locally and not retained.')
        except (ValueError,RuntimeError,OSError) as exc:
            with state_lock: state['audio_analysis']=None
            return jsonify(error=str(exc)),400
        except Exception as exc:
            app.logger.exception('EchoMap audio analysis failed')
            with state_lock: state['audio_analysis']=None
            return jsonify(error=f'Audio analysis failed: {type(exc).__name__}'),500

    @app.post('/api/moments/<ident>/clip')
    def api_export_clip(ident):
        moment = store.get_moment(ident)
        if not moment: return jsonify(error='Moment not found'), 404
        with state_lock: filename = state.get('source_video')
        if not filename: return jsonify(error='Upload a VOD file before exporting a clip.'), 400
        source = (UPLOADS / filename).resolve()
        if source.parent != UPLOADS.resolve() or not source.is_file(): return jsonify(error='Uploaded source is unavailable.'), 400
        body = request.get_json(silent=True) or {}
        try:
            offset = float(body.get('source_offset_seconds', 0))
            if not 0 <= offset <= 24 * 3600: raise ValueError('VOD offset must be between 0 and 86400 seconds.')
            output = EXPORTS / f'voxclutch-{ident}.mp4'
            export_clip(source, output, moment['start_seconds'], moment['end_seconds'], offset)
            store.update_status(ident, 'exported', output.name)
            return jsonify(ok=True, download_url=f'/api/exports/{output.name}', filename=output.name)
        except (ValueError, RuntimeError, OSError) as exc: return jsonify(error=str(exc)), 400
        except Exception as exc:
            app.logger.exception('Clip export failed')
            return jsonify(error=f'Clip export failed: {type(exc).__name__}'), 500

    @app.get('/api/exports/<filename>')
    def api_download(filename):
        if not re.fullmatch(r'voxclutch-[a-f0-9]{12}\.mp4', filename): return jsonify(error='Invalid export name'), 400
        path = (EXPORTS / filename).resolve()
        if path.parent != EXPORTS.resolve() or not path.is_file(): return jsonify(error='Export not found'), 404
        return send_file(path, as_attachment=True, download_name=filename, mimetype='video/mp4')

    @app.post('/api/clear')
    def api_clear():
        store.clear(); detector.reset()
        with state_lock: state.update(messages_seen=0, last_candidate_at=0)
        return jsonify(ok=True)

    @app.errorhandler(413)
    def too_large(_): return jsonify(error='Upload too large (maximum 500 MB).'), 413

    return app

app = create_app()

if __name__ == '__main__':
    port=int(os.environ.get('PORT', '5050'))
    if os.environ.get('VOXCLUTCH_ALLOW_REMOTE', '').lower() == '1':
        print(f'VoxClutch authenticated temporary preview listening on port {port}.')
        app.run(host='0.0.0.0', port=port, debug=False, threaded=True)
    else:
        print('VoxClutch local dashboard: http://127.0.0.1:5050')
        print('Local-only prototype: do not bind to 0.0.0.0 or expose to a network.')
        app.run(host='127.0.0.1', port=port, debug=False, threaded=True)
