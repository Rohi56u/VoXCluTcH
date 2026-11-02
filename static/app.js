const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));
let toastTimer;
let analyzedOffset = null;

function toast(message, kind = '') {
  const element = $('#toast');
  element.textContent = message;
  element.className = `toast show ${kind}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { element.className = 'toast'; }, 3400);
}

async function api(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  let body = {};
  try { body = await response.json(); } catch { /* Response may be empty. */ }
  if (!response.ok) throw new Error(body.error || `Request failed (${response.status})`);
  return body;
}

function shortClock(seconds) {
  const value = Math.max(0, Math.floor(Number(seconds) || 0));
  return `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
}

function renderMoment(moment) {
  const signals = moment.signals || {};
  const components = signals.score_components || {};
  const source = escapeHtml(moment.source || 'live');
  const status = moment.status || 'new';
  const score = Math.max(0, Math.min(100, Number(moment.score) || 0));
  const actions = status === 'dismissed'
    ? `<button class="mini-button keep" data-action="kept" data-id="${escapeHtml(moment.id)}">Restore</button>`
    : `<button class="mini-button keep" data-action="kept" data-id="${escapeHtml(moment.id)}">✓ Keep</button><button class="mini-button danger" data-action="dismissed" data-id="${escapeHtml(moment.id)}">Dismiss</button>`;
  const clip = status === 'exported' && moment.clip_path
    ? `<a class="mini-button" href="/api/exports/${encodeURIComponent(moment.clip_path)}">Download clip ↓</a>`
    : `<button class="mini-button" data-clip="${escapeHtml(moment.id)}">Make clip</button>`;
  const evidence = moment.audio_evidence;
  const echoMap = evidence?.available
    ? `<div class="echomap-result"><span class="echo-label">${escapeHtml(evidence.label)} · ${Number(evidence.delta_db) >= 0 ? '+' : ''}${Number(evidence.delta_db).toFixed(1)} dB</span><span>DUAL-SIGNAL RANK <b>${Number(moment.echomap_score).toFixed(0)}</b></span><span class="echo-explain">VOD peak vs nearby ambient audio. Not a probability.</span></div>`
    : '';

  return `<article class="moment-card">
    <div class="moment-top"><div><span class="moment-time">${shortClock(moment.start_seconds)} → ${shortClock(moment.end_seconds)}</span><span class="moment-source">${source}${status !== 'new' ? ` · ${escapeHtml(status)}` : ''}</span></div>
      <div class="moment-score"><div class="score-track"><i style="width:${score}%"></i></div>${score.toFixed(0)}<small>CHAT</small></div></div>
    <h3 class="moment-title">${status === 'dismissed' ? 'Dismissed reaction window' : 'Audience reaction spike'}</h3>
    <div class="signal-chips"><span class="signal-chip"><b>${signals.messages || 0}</b> msgs / ${signals.window_seconds || 15}s</span><span class="signal-chip"><b>${signals.unique_chatters || 0}</b> unique chatters</span><span class="signal-chip">velocity <b>${Math.round((Number(components.chat_velocity) || 0) * 100)}%</b></span><span class="signal-chip">entropy <b>${components.unique_chatter_entropy === undefined ? '—' : `${Math.round(Number(components.unique_chatter_entropy) * 100)}%`}</b></span><span class="signal-chip">reaction cues <b>${Math.round((Number(components.reaction_density) || 0) * 100)}%</b></span><span class="signal-chip"><b>${signals.reaction_messages || 0}</b> reaction messages</span></div>
    ${echoMap}
    <div class="moment-bottom"><div class="moment-explain">Why flagged: fast chat + ${signals.unique_chatters || 0} distinct voices${signals.reaction_messages ? ` + ${signals.reaction_messages} reaction cues` : ''}. Chat score is heuristic, not an AI verdict.</div><div class="moment-actions">${actions}${clip}</div></div>
  </article>`;
}

function renderQueue(moments) {
  const list = $('#momentList');
  $('#queueCount').textContent = `${moments.length} MOMENT${moments.length === 1 ? '' : 'S'}`;
  $('#momentCount').textContent = String(moments.length).padStart(2, '0');
  if (!moments.length) {
    list.innerHTML = '<div class="empty-state"><div class="empty-radar"><span>◉</span><i></i><i></i></div><strong>Your next standout moment starts here.</strong><p>Connect a channel or run the sample demo. VoxClutch stores signal summaries—not chat transcripts.</p></div>';
    return;
  }
  list.innerHTML = moments.map(renderMoment).join('');
}

async function refresh() {
  try {
    const [status, result] = await Promise.all([api('/api/status'), api('/api/moments')]);
    $('#messageCount').textContent = String(status.messages_seen || 0).padStart(2, '0');
    $('#uptime').textContent = shortClock(status.uptime_seconds || 0);
    const pill = $('#connectionPill');
    pill.className = `connection-pill ${['connected', 'demo'].includes(status.status) ? 'online' : status.status === 'error' ? 'error' : ''}`;
    $('#connectionLabel').textContent = status.status === 'connected' ? `LIVE · ${status.channel || ''}` : status.status === 'connecting' ? 'CONNECTING' : status.status === 'reconnecting' ? 'RECONNECTING' : status.status === 'demo' ? 'DEMO SIGNAL' : 'DEMO READY';
    $('#statusMessage').textContent = status.message || 'Ready';
    $('#statusIndicator').className = `status-indicator ${['connected', 'demo'].includes(status.status) ? 'online' : status.status === 'error' ? 'error' : ''}`;
    renderQueue(result.moments || []);
  } catch (error) { console.warn(error); }
}

$('#connectBtn').addEventListener('click', async () => {
  const channel = $('#channelInput').value.trim().replace(/^@/, '');
  if (!channel) { toast('Enter your Twitch channel name first.', 'error'); return; }
  $('#connectBtn').disabled = true;
  try {
    await api('/api/connect', { method: 'POST', body: JSON.stringify({ channel }) });
    toast(`Connecting to ${channel} public chat…`, 'success');
  } catch (error) { toast(error.message, 'error'); }
  finally { $('#connectBtn').disabled = false; refresh(); }
});
$('#channelInput').addEventListener('keydown', (event) => { if (event.key === 'Enter') $('#connectBtn').click(); });
$('#demoBtn').addEventListener('click', async () => {
  try { await api('/api/demo', { method: 'POST' }); toast('Sample reaction burst added to the queue.', 'success'); refresh(); }
  catch (error) { toast(error.message, 'error'); }
});
$('#clearBtn').addEventListener('click', async () => {
  if (!confirm('Clear all moment candidates? This cannot be undone.')) return;
  try { await api('/api/clear', { method: 'POST' }); toast('Queue cleared.'); refresh(); }
  catch (error) { toast(error.message, 'error'); }
});
$('#momentList').addEventListener('click', async (event) => {
  const action = event.target.closest('[data-action]');
  if (action) {
    try {
      await api(`/api/moments/${encodeURIComponent(action.dataset.id)}/review`, { method: 'POST', body: JSON.stringify({ status: action.dataset.action }) });
      toast(action.dataset.action === 'kept' ? 'Moment saved to your keepers.' : 'Moment dismissed.', 'success'); refresh();
    } catch (error) { toast(error.message, 'error'); }
    return;
  }
  const clip = event.target.closest('[data-clip]');
  if (clip) {
    clip.disabled = true; clip.textContent = 'Rendering…';
    try {
      const result = await api(`/api/moments/${encodeURIComponent(clip.dataset.clip)}/clip`, { method: 'POST', body: JSON.stringify({ source_offset_seconds: Number($('#offsetInput').value) || 0 }) });
      toast('Clip ready to download.', 'success'); window.location.href = result.download_url; refresh();
    } catch (error) { toast(error.message, 'error'); clip.disabled = false; clip.textContent = 'Make clip'; }
  }
});

$('#videoInput').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  $('#uploadStatus').textContent = `Uploading ${file.name}…`;
  $('#audioStatus').textContent = 'Waiting for EchoMap analysis.';
  $('#analyzeBtn').disabled = true;
  analyzedOffset = null;
  const form = new FormData(); form.append('video', file);
  try {
    const response = await fetch('/api/video', { method: 'POST', body: form });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || 'Upload failed');
    $('#uploadStatus').textContent = `Attached · ${file.name}`;
    $('#analyzeBtn').disabled = false;
    $('#removeVideoBtn').hidden = false;
    toast('VOD attached. Run EchoMap to compare sound with chat.', 'success');
  } catch (error) {
    $('#uploadStatus').textContent = 'No source video attached';
    toast(error.message, 'error');
  } finally { event.target.value = ''; }
});

$('#removeVideoBtn').addEventListener('click', async () => {
  if (!confirm('Remove the uploaded VOD and its EchoMap audio analysis from this computer?')) return;
  try {
    await api('/api/video', { method: 'DELETE' });
    $('#uploadStatus').textContent = 'No source video attached';
    $('#audioStatus').textContent = 'Uploaded VOD and audio analysis removed.';
    $('#analyzeBtn').disabled = true;
    $('#removeVideoBtn').hidden = true;
    analyzedOffset = null;
    toast('Local VOD removed.', 'success');
  } catch (error) { toast(error.message, 'error'); }
});

$('#analyzeBtn').addEventListener('click', async () => {
  const button = $('#analyzeBtn');
  const offset = Number($('#offsetInput').value) || 0;
  button.disabled = true; button.textContent = 'Analyzing locally…';
  $('#audioStatus').textContent = 'Reading audio energy locally; longer VODs can take a few minutes.';
  try {
    const result = await api('/api/audio/analyze', { method: 'POST', body: JSON.stringify({ source_offset_seconds: offset }) });
    analyzedOffset = offset;
    const minutes = Math.floor(result.duration_seconds / 60);
    const seconds = result.duration_seconds % 60;
    $('#audioStatus').textContent = `EchoMap scanned ${minutes}m ${seconds}s · ranked ${result.moments_analyzed} moments`;
    button.textContent = 'Re-run EchoMap';
    toast('EchoMap complete. Chat + audio evidence is now shown in the queue.', 'success');
    refresh();
  } catch (error) {
    $('#audioStatus').textContent = 'EchoMap could not analyze this VOD.';
    toast(error.message, 'error');
  } finally { button.disabled = false; button.textContent = analyzedOffset === null ? 'Analyze with EchoMap' : 'Re-run EchoMap'; }
});

$('#offsetInput').addEventListener('change', () => {
  const offset = Number($('#offsetInput').value) || 0;
  if (analyzedOffset !== null && offset !== analyzedOffset) {
    $('#audioStatus').textContent = 'Offset changed. Re-run EchoMap to update moment matching.';
    $('#analyzeBtn').textContent = 'Re-run EchoMap';
  }
});

setInterval(refresh, 2500);
refresh();
