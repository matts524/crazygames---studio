const express = require('express');
const fs      = require('fs');
const path    = require('path');
const { execFile } = require('child_process');

const app  = express();
const PORT = 3500;
const ROOT = __dirname;

app.use(express.json());
app.use(express.static(ROOT));

// ── Helpers ──────────────────────────────────────────────────
function readJSON(file) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'));
}
function writeJSON(file, data) {
  fs.writeFileSync(path.join(ROOT, file), JSON.stringify(data, null, 2));
}
function timestamp() {
  return new Date().toTimeString().slice(0, 5);
}
function logActivity(state, icon, msg, detail) {
  state.activityLog = state.activityLog || [];
  state.activityLog.push({ time: timestamp(), icon, msg, detail });
  if (state.activityLog.length > 50) state.activityLog.shift();
  state.lastUpdated = new Date().toISOString();
}

// ── GET /api/queue ────────────────────────────────────────────
app.get('/api/queue', (req, res) => {
  res.json(readJSON('pipeline/queue.json'));
});

// ── GET /api/state ────────────────────────────────────────────
app.get('/api/state', (req, res) => {
  res.json(readJSON('pipeline/state.json'));
});

// ── POST /api/approve/:id ─────────────────────────────────────
// Called when user clicks "Build This" on the dashboard
app.post('/api/approve/:id', (req, res) => {
  const { id }  = req.params;
  const { artStyle } = req.body;

  const queue = readJSON('pipeline/queue.json');
  const state = readJSON('pipeline/state.json');

  // Find the idea
  const idx = queue.ideas.findIndex(g => g.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Game not found' });

  const game = queue.ideas[idx];

  // Update art style if provided
  if (artStyle) game.artStyle = artStyle;

  // Mark approved and move to inProgress
  game.approved  = true;
  game.status    = 'research';
  game.progress  = 5;
  game.approvedAt = new Date().toISOString();
  game.activeAgent = 'researcher';

  queue.ideas.splice(idx, 1);
  queue.inProgress.push(game);

  // Update agent statuses
  state.agents.forEach(a => {
    if (a.id === 'ideator') {
      a.status = 'active';
      a.currentTask = `"${game.title}" approved → starting research`;
    } else if (a.id === 'researcher') {
      a.status = 'thinking';
      a.currentTask = `Researching ${game.title}...`;
    } else {
      a.status = 'idle';
    }
  });

  state.studioRunning = state.studioRunning !== false;
  logActivity(state, '✅', `Approved: ${game.title}`, `Moving to research pipeline`);
  logActivity(state, '🔬', `Research Agent activated`, `Analysing ${game.genre} genre trends for ${game.title}`);

  writeJSON('pipeline/queue.json', queue);
  writeJSON('pipeline/state.json', state);

  // Signal the build runner that work is waiting
  fs.writeFileSync(path.join(ROOT, 'pipeline/.build-trigger'), id);

  res.json({ ok: true, game });
});

// ── POST /api/pause ───────────────────────────────────────────
app.post('/api/pause', (req, res) => {
  const state = readJSON('pipeline/state.json');
  state.studioRunning = false;
  state.agents.forEach(a => { a.status = 'idle'; a.currentTask = 'Studio paused'; });
  logActivity(state, '⏸', 'Studio paused', 'No new cycles will start until resumed');
  writeJSON('pipeline/state.json', state);
  res.json({ ok: true });
});

// ── POST /api/resume ──────────────────────────────────────────
app.post('/api/resume', (req, res) => {
  const state = readJSON('pipeline/state.json');
  state.studioRunning = true;
  logActivity(state, '▶', 'Studio resumed', 'Pipeline will continue on next cycle');
  writeJSON('pipeline/state.json', state);
  res.json({ ok: true });
});

// ── POST /api/state ───────────────────────────────────────────
app.post('/api/state', (req, res) => {
  writeJSON('pipeline/state.json', req.body);
  res.json({ ok: true });
});

// ── POST /api/queue ───────────────────────────────────────────
app.post('/api/queue', (req, res) => {
  writeJSON('pipeline/queue.json', req.body);
  res.json({ ok: true });
});

// ── GET /api/tools ────────────────────────────────────────────
app.get('/api/tools', (req, res) => {
  try { res.json(readJSON('pipeline/tool-suggestions.json')); }
  catch(e) { res.json({ tools: [] }); }
});

// ── POST /api/tool/approve/:id ────────────────────────────────
app.post('/api/tool/approve/:id', (req, res) => {
  const data  = readJSON('pipeline/tool-suggestions.json');
  const tool  = data.tools.find(t => t.id === req.params.id);
  if (!tool) return res.status(404).json({ error: 'Tool not found' });

  tool.status     = 'approved';
  tool.approvedAt = new Date().toISOString();
  tool.integrationNotes = `Approved by user on ${new Date().toLocaleString()}. Integration will be applied on next build cycle.`;

  writeJSON('pipeline/tool-suggestions.json', data);

  // Log to state
  const state = readJSON('pipeline/state.json');
  logActivity(state, '✅', `Tool APPROVED: ${tool.name}`, `Will be integrated by Dev Agent on next build cycle`);
  writeJSON('pipeline/state.json', state);

  // Write integration trigger
  fs.writeFileSync(path.join(ROOT, 'pipeline/.tool-approved'), tool.id);

  res.json({ ok: true, tool });
});

// ── POST /api/tool/reject/:id ─────────────────────────────────
app.post('/api/tool/reject/:id', (req, res) => {
  const { reason } = req.body;
  const data = readJSON('pipeline/tool-suggestions.json');
  const tool = data.tools.find(t => t.id === req.params.id);
  if (!tool) return res.status(404).json({ error: 'Tool not found' });

  tool.status          = 'rejected';
  tool.rejectedAt      = new Date().toISOString();
  tool.rejectionReason = reason || 'No reason given';

  writeJSON('pipeline/tool-suggestions.json', data);

  const state = readJSON('pipeline/state.json');
  logActivity(state, '❌', `Tool rejected: ${tool.name}`, reason || 'User declined');
  writeJSON('pipeline/state.json', state);

  res.json({ ok: true });
});

// ── Watch for build trigger ───────────────────────────────────
// When .build-trigger file appears, run the build cycle
const TRIGGER = path.join(ROOT, 'pipeline/.build-trigger');
fs.watch(path.join(ROOT, 'pipeline'), (event, filename) => {
  if (filename === '.build-trigger' && fs.existsSync(TRIGGER)) {
    const gameId = fs.readFileSync(TRIGGER, 'utf8').trim();
    fs.unlinkSync(TRIGGER);
    console.log(`\n🚀 Build triggered for: ${gameId}`);
    console.log(`   → Claude will build this on next cycle`);
    console.log(`   → Open Claude Code and say: "run next cycle"`);
    console.log(`   → Or wait for the scheduled loop to pick it up\n`);
  }
});

app.listen(PORT, () => {
  console.log(`\n🎮 Game Studio Server running at http://localhost:${PORT}`);
  console.log(`   Dashboard: http://localhost:${PORT}/dashboard.html`);
  console.log(`   iframe Tester: http://localhost:${PORT}/iframe-test.html`);
  console.log(`\n   Press Ctrl+C to stop\n`);
});
