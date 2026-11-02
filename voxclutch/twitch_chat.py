"""Read-only public Twitch IRC listener; no OAuth token or channel-action scope."""
from __future__ import annotations
import re
import threading
import time
import uuid
from datetime import datetime, timezone

CHANNEL_RE = re.compile(r'^[a-zA-Z0-9_]{1,25}$')

class TwitchChatListener:
    def __init__(self, on_message, on_status=lambda *_: None):
        self.on_message = on_message
        self.on_status = on_status
        self._thread = None
        self._stop = threading.Event()
        self._channel = None
        self._lock = threading.Lock()

    @property
    def channel(self): return self._channel
    @property
    def running(self): return bool(self._thread and self._thread.is_alive() and not self._stop.is_set())

    def start(self, channel: str):
        channel = channel.strip().lstrip('#').lower()
        if not CHANNEL_RE.fullmatch(channel):
            raise ValueError('Enter a valid Twitch channel login (letters, numbers, underscore; max 25).')
        with self._lock:
            if self.running and self._channel == channel:
                return
            self.stop()
            self._stop.clear()
            self._channel = channel
            self._thread = threading.Thread(target=self._run, args=(channel,), daemon=True, name='voxclutch-twitch-chat')
            self._thread.start()

    def stop(self):
        self._stop.set()
        thread = self._thread
        if thread and thread.is_alive() and thread is not threading.current_thread():
            thread.join(timeout=2)
        self._thread = None

    def _run(self, channel):
        # Lazy import keeps offline/demo mode usable when the optional dependency is absent.
        try:
            import websocket
        except ImportError:
            self.on_status('error', 'Install requirements to enable Twitch chat.')
            return
        delay = 2
        while not self._stop.is_set():
            ws = None
            try:
                self.on_status('connecting', f'Connecting to #{channel} public chat…')
                ws = websocket.create_connection('wss://irc-ws.chat.twitch.tv:443', timeout=12, enable_multithread=True)
                ws.settimeout(1.5)
                nick = 'justinfan' + str(int(time.time()) % 1000000)
                ws.send('PASS SCHMOOPIIE\r\nNICK ' + nick + '\r\nCAP REQ :twitch.tv/tags twitch.tv/commands\r\nJOIN #' + channel + '\r\n')
                self.on_status('connected', f'Listening to #{channel} (read-only public chat).')
                delay = 2
                while not self._stop.is_set():
                    try: packet = ws.recv()
                    except Exception as exc:
                        if exc.__class__.__name__ in {'WebSocketTimeoutException','timeout'}: continue
                        raise
                    if not packet: raise ConnectionError('Twitch closed the chat connection')
                    for line in packet.splitlines():
                        if line.startswith('PING'):
                            ws.send('PONG :tmi.twitch.tv\r\n'); continue
                        if ' PRIVMSG #' not in line: continue
                        try:
                            prefix, body = line.split(' PRIVMSG #', 1)
                            message = body.split(' :', 1)[1]
                            user = prefix.rsplit('!', 1)[0].split()[-1].lstrip(':')
                            self.on_message({'user': user, 'text': message[:500], 'at': datetime.now(timezone.utc).isoformat(), 'id': uuid.uuid4().hex, 'source': 'twitch'})
                        except (IndexError, ValueError):
                            continue
            except Exception as exc:
                if not self._stop.is_set():
                    self.on_status('reconnecting', f'Chat disconnected; retrying in {delay}s.')
                    self._stop.wait(delay)
                    delay = min(delay * 2, 30)
            finally:
                if ws:
                    try: ws.close()
                    except Exception: pass
        self.on_status('disconnected', 'Twitch listener stopped.')
