"""Small SQLite repository. Chat text is never persisted; candidate evidence is."""
from __future__ import annotations
import json
import sqlite3
import threading
import uuid
from contextlib import contextmanager
from datetime import datetime, timedelta, timezone
from pathlib import Path

class MomentStore:
    def __init__(self, path: str | Path):
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._lock = threading.RLock()
        self._init()

    def _connect(self):
        db = sqlite3.connect(self.path, timeout=10, check_same_thread=False)
        db.row_factory = sqlite3.Row
        db.execute("PRAGMA journal_mode=WAL")
        db.execute("PRAGMA foreign_keys=ON")
        return db

    @contextmanager
    def _connection(self):
        db = self._connect()
        try:
            with db:
                yield db
        finally:
            db.close()

    def _init(self):
        with self._connection() as db:
            db.execute("""CREATE TABLE IF NOT EXISTS moments (
                id TEXT PRIMARY KEY, created_at TEXT NOT NULL, start_seconds REAL NOT NULL,
                end_seconds REAL NOT NULL, score REAL NOT NULL, signals_json TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','kept','dismissed','exported')),
                clip_path TEXT, source TEXT NOT NULL DEFAULT 'live'
            )""")
            db.execute("CREATE INDEX IF NOT EXISTS idx_moments_created ON moments(created_at DESC)")
            db.execute("CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)")

    def create_moment(self, *, created_at: str, start_seconds: float, end_seconds: float, score: float, signals: dict, source: str = 'live') -> dict:
        ident = uuid.uuid4().hex[:12]
        with self._lock, self._connection() as db:
            db.execute("INSERT INTO moments(id,created_at,start_seconds,end_seconds,score,signals_json,source) VALUES(?,?,?,?,?,?,?)",
                       (ident, created_at, max(0, float(start_seconds)), max(0, float(end_seconds)), float(score), json.dumps(signals), source))
        return self.get_moment(ident)

    def get_moment(self, ident: str) -> dict | None:
        with self._connection() as db:
            row = db.execute("SELECT * FROM moments WHERE id=?", (ident,)).fetchone()
        return self._row(row) if row else None

    @staticmethod
    def _row(row):
        item = dict(row)
        item['signals'] = json.loads(item.pop('signals_json'))
        return item

    def list_moments(self, limit: int = 100) -> list[dict]:
        with self._connection() as db:
            rows = db.execute("SELECT * FROM moments ORDER BY created_at DESC LIMIT ?", (max(1, min(int(limit), 250)),)).fetchall()
        return [self._row(r) for r in rows]

    def update_status(self, ident: str, status: str, clip_path: str | None = None) -> dict | None:
        if status not in {'new','kept','dismissed','exported'}:
            raise ValueError('Unsupported review status')
        with self._lock, self._connection() as db:
            cur = db.execute("UPDATE moments SET status=?, clip_path=COALESCE(?,clip_path) WHERE id=?", (status, clip_path, ident))
            if cur.rowcount != 1:
                return None
        return self.get_moment(ident)

    def clear(self) -> None:
        with self._lock, self._connection() as db:
            db.execute("DELETE FROM moments")

    def delete_older_than(self, hours: int = 24) -> int:
        cutoff = (datetime.now(timezone.utc) - timedelta(hours=max(1, hours))).isoformat()
        with self._lock, self._connection() as db:
            cur = db.execute("DELETE FROM moments WHERE created_at < ?", (cutoff,))
            return cur.rowcount

    def get_setting(self, key: str, default=None):
        with self._connection() as db:
            row = db.execute("SELECT value FROM settings WHERE key=?", (key,)).fetchone()
        if not row:
            return default
        try: return json.loads(row['value'])
        except json.JSONDecodeError: return default

    def set_setting(self, key: str, value) -> None:
        with self._lock, self._connection() as db:
            db.execute("INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value", (key, json.dumps(value)))
