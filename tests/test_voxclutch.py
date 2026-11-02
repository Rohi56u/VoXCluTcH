import io
import base64
import os
import tempfile
import unittest
from unittest.mock import patch
from datetime import datetime, timedelta, timezone
from pathlib import Path
from app import create_app
from voxclutch.echomap import audio_evidence
from voxclutch.scoring import MomentDetector
from voxclutch.store import MomentStore

class DetectorTests(unittest.TestCase):
    def setUp(self): self.detector = MomentDetector()

    def test_detects_reaction_burst_with_explainable_components(self):
        base = datetime(2026, 1, 1, tzinfo=timezone.utc)
        result = None
        for i in range(8):
            result = self.detector.ingest(f'user{i % 6}', 'Poggers! letsgo clutch', base + timedelta(seconds=i), f'id-{i}')
        self.assertIsNotNone(result)
        self.assertGreaterEqual(result['score'], 58)
        self.assertEqual(result['signals']['messages'], 8)
        self.assertEqual(result['signals']['unique_chatters'], 6)
        self.assertEqual(result['signals']['reaction_messages'], 8)
        self.assertEqual(set(result['signals']['score_components']), {'chat_velocity','unique_participation','reaction_density'})

    def test_duplicate_event_is_ignored(self):
        now = datetime.now(timezone.utc)
        self.detector.ingest('a','hello',now,'same')
        self.detector.ingest('b','pog',now,'same')
        self.assertEqual(len(self.detector.events),1)

    def test_unique_chatter_gate_blocks_single_user_spam(self):
        now = datetime.now(timezone.utc)
        result = None
        for i in range(10): result = self.detector.ingest('one_user','pog',now,f'e{i}')
        self.assertIsNone(result)

    def test_old_events_expire(self):
        now = datetime.now(timezone.utc)
        self.detector.ingest('a','x',now,'a')
        self.detector.ingest('b','x',now+timedelta(seconds=20),'b')
        self.assertEqual(len(self.detector.events),1)

    def test_reset_clears_window_and_dedup(self):
        now = datetime.now(timezone.utc)
        self.detector.ingest('a','x',now,'id')
        self.detector.reset()
        self.assertEqual(len(self.detector.events),0)
        self.assertNotIn('id',self.detector.seen)

    def test_deduplication_memory_is_bounded(self):
        now = datetime.now(timezone.utc)
        for i in range(4200): self.detector.ingest('a','x',now,f'id-{i}')
        self.assertEqual(len(self.detector.seen),4096)

class StoreTests(unittest.TestCase):
    def test_candidate_review_and_clip_state_roundtrip(self):
        with tempfile.TemporaryDirectory() as tmp:
            store = MomentStore(Path(tmp)/'test.sqlite3')
            item = store.create_moment(created_at=datetime.now(timezone.utc).isoformat(),start_seconds=2,end_seconds=17,score=74.2,signals={'messages':8})
            self.assertEqual(item['signals']['messages'],8)
            self.assertEqual(store.update_status(item['id'],'kept')['status'],'kept')
            saved=store.update_status(item['id'],'exported','voxclutch-deadbeef1234.mp4')
            self.assertEqual(saved['clip_path'],'voxclutch-deadbeef1234.mp4')
            self.assertEqual(len(store.list_moments()),1)
            self.assertIsNone(store.update_status('missing','kept'))

    def test_invalid_status_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            store=MomentStore(Path(tmp)/'test.sqlite3')
            with self.assertRaises(ValueError): store.update_status('missing','posted')

class EchoMapTests(unittest.TestCase):
    def test_audio_peak_is_compared_with_nearby_ambient_sound(self):
        levels=[-40.0]*100
        levels[5:15]=[-12.0]*10
        evidence=audio_evidence(levels,0,15)
        self.assertTrue(evidence['available'])
        self.assertEqual(evidence['delta_db'],28.0)
        self.assertEqual(evidence['label'],'Strong audio echo')
        self.assertEqual(evidence['audio_fit'],100.0)

    def test_out_of_vod_candidate_has_no_audio_claim(self):
        evidence=audio_evidence([-40.0]*10,20,30)
        self.assertFalse(evidence['available'])

class ApiTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory()
        self.app=create_app({'TESTING':True,'DATABASE':str(Path(self.tmp.name)/'api.sqlite3')})
        self.client=self.app.test_client()

    def tearDown(self):
        filename=self.app.extensions['voxclutch_state'].get('source_video')
        if filename: (Path(self.app.root_path)/'uploads'/filename).unlink(missing_ok=True)
        self.tmp.cleanup()

    def test_home_and_status(self):
        self.assertEqual(self.client.get('/').status_code,200)
        body=self.client.get('/api/status').get_json()
        self.assertEqual(body['status'],'idle')
        self.assertFalse(body['listener_running'])

    def test_demo_creates_candidate_with_explicit_source(self):
        response=self.client.post('/api/demo')
        self.assertEqual(response.status_code,200)
        body=self.client.get('/api/moments').get_json()
        self.assertGreaterEqual(len(body['moments']),1)
        self.assertTrue(all(m['source']=='demo' for m in body['moments']))
        self.assertGreater(body['moments'][0]['score'],0)

    def test_channel_validation_and_state_change(self):
        bad=self.client.post('/api/connect',json={'channel':'bad channel!'})
        self.assertEqual(bad.status_code,400)
        listener=self.app.extensions['voxclutch_listener']
        with patch.object(listener,'start') as start_listener:
            good=self.client.post('/api/connect',json={'channel':'test_channel'})
            start_listener.assert_called_once_with('test_channel')
        self.assertEqual(good.status_code,200)
        self.assertEqual(good.get_json()['channel'],'test_channel')
        self.client.post('/api/disconnect')

    def test_review_validation_and_clear(self):
        self.client.post('/api/demo')
        moment=self.client.get('/api/moments').get_json()['moments'][0]
        response=self.client.post(f"/api/moments/{moment['id']}/review",json={'status':'kept'})
        self.assertEqual(response.get_json()['moment']['status'],'kept')
        self.assertEqual(self.client.post(f"/api/moments/{moment['id']}/review",json={'status':'publish'}).status_code,400)
        self.assertEqual(self.client.post('/api/clear').status_code,200)
        self.assertEqual(len(self.client.get('/api/moments').get_json()['moments']),0)

    def test_upload_extension_validation(self):
        response=self.client.post('/api/video',data={'video':(io.BytesIO(b'not really a video'),'test.exe')},content_type='multipart/form-data')
        self.assertEqual(response.status_code,400)

    def test_origin_prefix_spoof_is_rejected(self):
        response=self.client.post('/api/demo',headers={'Origin':'http://localhost.attacker.invalid'})
        self.assertEqual(response.status_code,403)

    def test_echomap_analyzes_uploaded_vod_and_enriches_candidate(self):
        self.client.post('/api/demo')
        upload=self.client.post('/api/video',data={'video':(io.BytesIO(b'test fixture'),'sample.mp4')},content_type='multipart/form-data')
        self.assertEqual(upload.status_code,200)
        levels=[-40.0]*100
        levels[0:15]=[-10.0]*15
        with patch('app.analyze_audio_levels',return_value=levels) as analyze:
            response=self.client.post('/api/audio/analyze',json={'source_offset_seconds':0})
        self.assertEqual(response.status_code,200,response.get_json())
        analyze.assert_called_once()
        moment=self.client.get('/api/moments').get_json()['moments'][0]
        self.assertTrue(moment['audio_evidence']['available'])
        self.assertEqual(moment['audio_evidence']['label'],'Strong audio echo')
        self.assertGreater(moment['echomap_score'],moment['score'])

    def test_echomap_requires_video_and_rejects_invalid_offset(self):
        missing=self.client.post('/api/audio/analyze',json={'source_offset_seconds':0})
        self.assertEqual(missing.status_code,400)
        self.client.post('/api/video',data={'video':(io.BytesIO(b'test fixture'),'sample.mp4')},content_type='multipart/form-data')
        invalid=self.client.post('/api/audio/analyze',json={'source_offset_seconds':-1})
        self.assertEqual(invalid.status_code,400)

    def test_remove_vod_deletes_source_and_analysis(self):
        self.client.post('/api/video',data={'video':(io.BytesIO(b'test fixture'),'sample.mp4')},content_type='multipart/form-data')
        state=self.app.extensions['voxclutch_state']
        filename=state['source_video']
        source=Path(self.app.root_path)/'uploads'/filename
        self.assertTrue(source.exists())
        state['audio_analysis']={'filename':filename,'levels_db':[-40.0],'source_offset_seconds':0}
        response=self.client.delete('/api/video')
        self.assertEqual(response.status_code,200)
        self.assertFalse(source.exists())
        self.assertIsNone(state['source_video'])
        self.assertIsNone(state['audio_analysis'])

class PreviewAuthTests(unittest.TestCase):
    def test_remote_preview_requires_basic_auth_and_accepts_managed_https_host(self):
        password='temporary-test-secret'
        host='5050-test-environment.sg2.manus.computer'
        credentials=base64.b64encode(f'tester:{password}'.encode()).decode()
        with tempfile.TemporaryDirectory() as tmp, patch.dict(os.environ,{'VOXCLUTCH_ALLOW_REMOTE':'1','VOXCLUTCH_PREVIEW_USER':'tester','VOXCLUTCH_PREVIEW_PASSWORD':password}):
            app=create_app({'TESTING':True,'DATABASE':str(Path(tmp)/'preview.sqlite3')})
            client=app.test_client()
            unauth=client.get('/',headers={'Host':host},environ_base={'REMOTE_ADDR':'192.0.2.44','wsgi.url_scheme':'https'})
            self.assertEqual(unauth.status_code,401)
            headers={'Host':host,'Authorization':f'Basic {credentials}','X-Forwarded-Proto':'https'}
            response=client.get('/',headers=headers,environ_base={'REMOTE_ADDR':'192.0.2.44','wsgi.url_scheme':'http'})
            self.assertEqual(response.status_code,200)
            self.assertIn(b'VoxClutch',response.data)

if __name__=='__main__': unittest.main()
