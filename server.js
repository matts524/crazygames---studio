const express = require('express');
const fs      = require('fs');
const path    = require('path');
const https   = require('https');
const http    = require('http');
const { execSync } = require('child_process');

const app  = express();
const PORT = 3500;
const ROOT = __dirname;

app.use(express.json());
app.use(express.static(ROOT));

// ── Helpers ───────────────────────────────────────────────────
function readJSON(file) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'));
}
function writeJSON(file, data) {
  fs.writeFileSync(path.join(ROOT, file), JSON.stringify(data, null, 2));
}
function timestamp() { return new Date().toTimeString().slice(0,5); }
function logActivity(state, icon, msg, detail) {
  state.activityLog = state.activityLog || [];
  state.activityLog.push({ time: timestamp(), icon, msg, detail });
  if (state.activityLog.length > 50) state.activityLog.shift();
  state.lastUpdated = new Date().toISOString();
}

// Download a file from URL to local path, following redirects
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const file  = fs.createWriteStream(dest);
    proto.get(url, res => {
      // Follow redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', err => { file.close(); try { fs.unlinkSync(dest); } catch(e){} reject(err); });
  });
}

// Append text to a file if the text isn't already there
function appendIfMissing(filePath, marker, content) {
  const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
  if (existing.includes(marker)) return; // already added
  fs.appendFileSync(filePath, '\n' + content);
}

// ── TOOL INTEGRATION HANDLERS ─────────────────────────────────
// Each handler receives a `progress(pct, stage, log)` callback
// so SSE can stream real-time updates to the dashboard.

const INTEGRATIONS = {

  littlejs: async (progress) => {
    const dest = path.join(ROOT, 'templates', 'littlejs.min.js');
    progress(10, 'Downloading', '📥 Fetching littlejs.min.js from jsDelivr CDN...');
    await downloadFile('https://cdn.jsdelivr.net/gh/KilledByAPixel/LittleJS@main/dist/littlejs.min.js', dest);
    const size = Math.round(fs.statSync(dest).size / 1024);
    progress(40, 'Downloaded', `✅ littlejs.min.js saved (${size}kb) → templates/`);

    progress(55, 'Updating agent instructions', '📝 Writing to agents/AGENT_INSTRUCTIONS.md...');
    appendIfMissing(path.join(ROOT, 'agents', 'AGENT_INSTRUCTIONS.md'), 'LittleJS INTEGRATED',
      `\n## LittleJS INTEGRATED ✅\nAll new games MUST use LittleJS engine.\nAdd: <script src="../../templates/littlejs.min.js"></script>\nDocs: https://github.com/KilledByAPixel/LittleJS\n`);
    progress(70, 'Updating knowledge base', '📚 Writing to knowledge/KNOWLEDGE.md...');
    appendIfMissing(path.join(ROOT, 'knowledge', 'KNOWLEDGE.md'), 'LittleJS available',
      `13. **LittleJS available** — game engine at templates/littlejs.min.js\n`);
    progress(85, 'Committing to GitHub', '🚀 Pushing to matts524/crazygames---studio...');
  },

  zzfx: async (progress) => {
    const dest = path.join(ROOT, 'templates', 'zzfx.min.js');
    progress(10, 'Downloading', '📥 Fetching ZzFXMicro.min.js from jsDelivr CDN...');
    await downloadFile('https://cdn.jsdelivr.net/gh/KilledByAPixel/ZzFX@master/ZzFXMicro.min.js', dest);
    const size = fs.statSync(dest).size;
    progress(40, 'Downloaded', `✅ zzfx.min.js saved (${size} bytes) → templates/`);

    progress(55, 'Updating agent instructions', '📝 Writing to agents/AGENT_INSTRUCTIONS.md...');
    appendIfMissing(path.join(ROOT, 'agents', 'AGENT_INSTRUCTIONS.md'), 'ZzFX INTEGRATED',
      `\n## ZzFX INTEGRATED ✅\nAll games use ZzFX for sounds. Add: <script src="../../templates/zzfx.min.js"></script>\nDesigner: https://killedbyapixel.github.io/ZzFX/\n`);
    progress(70, 'Updating knowledge base', '📚 Writing to knowledge/techniques/audio.md...');
    appendIfMissing(path.join(ROOT, 'knowledge', 'techniques', 'audio.md'), 'ZzFX integrated',
      `\n## ZzFX Integrated ✅\nDesign sounds at: https://killedbyapixel.github.io/ZzFX/\n`);
    progress(85, 'Committing to GitHub', '🚀 Pushing to GitHub...');
  },

  zzfxm: async (progress) => {
    const dest = path.join(ROOT, 'templates', 'zzfxm.min.js');
    progress(10, 'Downloading', '📥 Fetching zzfxm.min.js from jsDelivr CDN...');
    await downloadFile('https://cdn.jsdelivr.net/gh/keithclark/ZzFXM@master/zzfxm.min.js', dest);
    const size = Math.round(fs.statSync(dest).size / 1024 * 10) / 10;
    progress(40, 'Downloaded', `✅ zzfxm.min.js saved (${size}kb) → templates/`);

    progress(60, 'Updating agent instructions', '📝 Writing instructions...');
    appendIfMissing(path.join(ROOT, 'agents', 'AGENT_INSTRUCTIONS.md'), 'ZzFXM INTEGRATED',
      `\n## ZzFXM INTEGRATED ✅\nBackground music support. Add: <script src="../../templates/zzfxm.min.js"></script>\nCompose at: https://notecraft.fun\n`);
    progress(85, 'Committing to GitHub', '🚀 Pushing to GitHub...');
  },

  playwright: async (progress) => {
    progress(10, 'Installing', '📥 Running npm install playwright...');
    try {
      execSync('npm install --save-dev playwright', { cwd: ROOT, stdio: 'pipe' });
      progress(35, 'Installing browser', '📥 Downloading Playwright Chromium browser...');
      execSync('npx playwright install chromium', { cwd: ROOT, stdio: 'pipe' });
    } catch(e) { progress(35, 'Warning', '⚠ npm install completed with warnings'); }
    progress(55, 'Creating test files', '📝 Writing tests/game-qa.spec.js...');
    const testDir = path.join(ROOT, 'tests');
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir);
    const testFile = path.join(testDir, 'game-qa.spec.js');
    if (!fs.existsSync(testFile)) {
      fs.writeFileSync(testFile,
`const { test, expect } = require('@playwright/test');
test('game loads', async ({ page }) => {
  await page.goto('http://localhost:3456/index.html');
  await page.waitForTimeout(1000);
  expect(await page.$('canvas')).toBeTruthy();
});
test('game starts on click', async ({ page }) => {
  await page.goto('http://localhost:3456/index.html');
  await page.waitForTimeout(500);
  await page.click('canvas');
  await page.waitForTimeout(500);
  const state = await page.evaluate(() => window.state);
  expect(state).toBe(1);
});`);
    }
    const pkg = readJSON('package.json');
    if (!pkg.scripts) pkg.scripts = {};
    pkg.scripts['test:qa'] = 'playwright test tests/game-qa.spec.js';
    writeJSON('package.json', pkg);
    progress(75, 'Updating QA agent', '📝 Writing to agents/qa-agent-instructions.md...');
    appendIfMissing(path.join(ROOT, 'agents', 'qa-agent-instructions.md'), 'Playwright INTEGRATED',
      `\n## Playwright INTEGRATED ✅\nRun: npm run test:qa\nBase template: tests/game-qa.spec.js\n`);
    progress(85, 'Committing to GitHub', '🚀 Pushing to GitHub...');
  },

  piskel: async (progress) => {
    progress(20, 'Setting up launcher', '📝 Creating OPEN SPRITE EDITOR.bat...');
    fs.writeFileSync(path.join(ROOT, 'OPEN SPRITE EDITOR.bat'),
      `@echo off\necho Opening Piskel Sprite Editor...\nstart "" "https://www.piskelapp.com/p/create/frame"\n`);
    progress(55, 'Updating agent instructions', '📝 Writing to AGENT_INSTRUCTIONS.md...');
    appendIfMissing(path.join(ROOT, 'agents', 'AGENT_INSTRUCTIONS.md'), 'Piskel AVAILABLE',
      `\n## Piskel AVAILABLE ✅\nSprite editor: https://www.piskelapp.com\nOr run OPEN SPRITE EDITOR.bat\n`);
    progress(85, 'Committing to GitHub', '🚀 Pushing to GitHub...');
  }
};

// ── GET /api/tool/integrate-stream/:id  (Server-Sent Events) ──
// Streams real-time progress back to the dashboard while integrating
app.get('/api/tool/integrate-stream/:id', async (req, res) => {
  const data = readJSON('pipeline/tool-suggestions.json');
  const tool = data.tools.find(t => t.id === req.params.id);
  if (!tool) { res.status(404).end(); return; }

  // SSE headers
  res.writeHead(200, {
    'Content-Type':  'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection':    'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  const send = (pct, stage, log, done = false, error = null) => {
    res.write(`data: ${JSON.stringify({ pct, stage, log, done, error })}\n\n`);
  };

  // Mark as integrating
  tool.status     = 'integrating';
  tool.approvedAt = new Date().toISOString();
  writeJSON('pipeline/tool-suggestions.json', data);

  const state = readJSON('pipeline/state.json');
  logActivity(state, '🔧', `Integrating: ${tool.name}`, 'Download started');
  const tsAgent = state.agents.find(a => a.id === 'toolscout');
  if (tsAgent) { tsAgent.status = 'active'; tsAgent.currentTask = `Integrating ${tool.name}...`; }
  writeJSON('pipeline/state.json', state);

  send(5, 'Starting', `🔭 Tool Scout integrating: ${tool.name}`);

  const handler = INTEGRATIONS[tool.id];
  let integrationError = null;
  const logs = [];

  // Progress callback passed to each handler
  const progress = (pct, stage, log) => {
    logs.push(log);
    send(pct, stage, log);
  };

  try {
    if (handler) {
      await handler(progress);
    } else {
      progress(50, 'Configuring', `ℹ ${tool.name} uses online tools — setting up launcher`);
    }

    // Git commit
    send(88, 'Saving to GitHub', '🚀 Committing and pushing to GitHub...');
    try {
      execSync(`git add -A && git commit -m "Tool Scout: integrated ${tool.name}"`, { cwd: ROOT, stdio: 'pipe' });
      execSync('git push', { cwd: ROOT, stdio: 'pipe' });
      logs.push('✅ Committed and pushed to GitHub');
      send(95, 'GitHub updated', '✅ Pushed to matts524/crazygames---studio');
    } catch(e) { send(95, 'GitHub skipped', '⚠ Git push skipped (no changes or auth issue)'); }

    // Mark complete
    tool.status = 'integrated';
    tool.integrationNotes = logs.join('\n');
    writeJSON('pipeline/tool-suggestions.json', data);

    const state2 = readJSON('pipeline/state.json');
    logActivity(state2, '🔧', `INTEGRATED: ${tool.name}`, 'All steps complete');
    if (tsAgent) { tsAgent.status = 'idle'; tsAgent.currentTask = `${tool.name} integrated ✓`; }
    writeJSON('pipeline/state.json', state2);

    send(100, 'Complete', `✅ ${tool.name} is now part of your studio!`, true);

  } catch(err) {
    integrationError = err.message;
    tool.status = 'approved'; // revert to approved so user can retry
    tool.integrationNotes = `Error: ${err.message}`;
    writeJSON('pipeline/tool-suggestions.json', data);
    send(100, 'Error', `❌ ${err.message}`, true, err.message);
  }

  res.end();
});

// ── POST /api/tool/approve/:id  (kept for fallback) ───────────
app.post('/api/tool/approve/:id', (req, res) => {
  const data = readJSON('pipeline/tool-suggestions.json');
  const tool = data.tools.find(t => t.id === req.params.id);
  if (!tool) return res.status(404).json({ error: 'Not found' });
  tool.status = 'approved';
  tool.approvedAt = new Date().toISOString();
  writeJSON('pipeline/tool-suggestions.json', data);
  res.json({ ok: true, streamUrl: `/api/tool/integrate-stream/${req.params.id}` });
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

// ── GET /api/tools ────────────────────────────────────────────
app.get('/api/tools', (req, res) => {
  try { res.json(readJSON('pipeline/tool-suggestions.json')); }
  catch(e) { res.json({ tools: [] }); }
});

// ── POST /api/approve/:id  (game build approval) ──────────────
app.post('/api/approve/:id', (req, res) => {
  const { id } = req.params;
  const { artStyle } = req.body;
  const queue = readJSON('pipeline/queue.json');
  const state = readJSON('pipeline/state.json');
  const idx = queue.ideas.findIndex(g => g.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Game not found' });
  const game = queue.ideas[idx];
  if (artStyle) game.artStyle = artStyle;
  game.approved   = true;
  game.status     = 'research';
  game.progress   = 5;
  game.approvedAt = new Date().toISOString();
  game.activeAgent = 'researcher';
  queue.ideas.splice(idx, 1);
  queue.inProgress.push(game);
  state.agents.forEach(a => {
    a.status      = a.id === 'ideator' ? 'active' : a.id === 'researcher' ? 'thinking' : 'idle';
    a.currentTask = a.id === 'ideator' ? `"${game.title}" approved` : a.id === 'researcher' ? `Researching ${game.title}...` : a.currentTask;
  });
  logActivity(state, '✅', `Approved: ${game.title}`, 'Moving to research pipeline');
  logActivity(state, '🔬', `Research Agent activated`, `Analysing ${game.genre} for ${game.title}`);
  writeJSON('pipeline/queue.json', queue);
  writeJSON('pipeline/state.json', state);
  fs.writeFileSync(path.join(ROOT, 'pipeline/.build-trigger'), id);
  res.json({ ok: true, game });
});

// ── POST /api/pause / /api/resume ─────────────────────────────
app.post('/api/pause', (req, res) => {
  const state = readJSON('pipeline/state.json');
  state.studioRunning = false;
  logActivity(state, '⏸', 'Studio paused', 'No new cycles until resumed');
  writeJSON('pipeline/state.json', state);
  res.json({ ok: true });
});
app.post('/api/resume', (req, res) => {
  const state = readJSON('pipeline/state.json');
  state.studioRunning = true;
  logActivity(state, '▶', 'Studio resumed', 'Pipeline continuing');
  writeJSON('pipeline/state.json', state);
  res.json({ ok: true });
});

// ── POST /api/state / /api/queue ──────────────────────────────
app.post('/api/state', (req, res) => { writeJSON('pipeline/state.json', req.body); res.json({ ok: true }); });
app.post('/api/queue', (req, res) => { writeJSON('pipeline/queue.json', req.body); res.json({ ok: true }); });

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n🎮 Game Studio Server  →  http://localhost:' + PORT);
  console.log('   Dashboard           →  http://localhost:' + PORT + '/dashboard.html');
  console.log('   iframe Tester       →  http://localhost:' + PORT + '/iframe-test.html');
  console.log('\n   Tool approvals now integrate IMMEDIATELY ✅');
  console.log('   Press Ctrl+C to stop\n');
});
