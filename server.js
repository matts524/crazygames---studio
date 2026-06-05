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
// Each handler downloads, installs, and wires up the tool.
// Returns an array of log messages describing what was done.

const INTEGRATIONS = {

  littlejs: async () => {
    const logs = [];
    const dest = path.join(ROOT, 'templates', 'littlejs.min.js');
    logs.push('📥 Downloading littlejs.min.js from jsDelivr CDN...');
    await downloadFile(
      'https://cdn.jsdelivr.net/gh/KilledByAPixel/LittleJS@main/dist/littlejs.min.js',
      dest
    );
    const size = Math.round(fs.statSync(dest).size / 1024);
    logs.push(`✅ Downloaded littlejs.min.js (${size}kb) → templates/littlejs.min.js`);

    // Update AGENT_INSTRUCTIONS to note LittleJS is available
    appendIfMissing(
      path.join(ROOT, 'agents', 'AGENT_INSTRUCTIONS.md'),
      'LittleJS INTEGRATED',
      `## LittleJS INTEGRATED ✅\nAll new games MUST use LittleJS engine.\nAdd to every new game: <script src="../../templates/littlejs.min.js"></script>\nDocs: https://github.com/KilledByAPixel/LittleJS\nUse LittleJS objects (vec2, Color, drawRect, Sound, etc.) instead of hand-coding.\n`
    );
    logs.push('✅ Updated agents/AGENT_INSTRUCTIONS.md — Dev Agent will use LittleJS for all future games');

    // Update knowledge base
    appendIfMissing(
      path.join(ROOT, 'knowledge', 'KNOWLEDGE.md'),
      'LittleJS available',
      `13. **LittleJS available** — game engine at templates/littlejs.min.js — use it instead of hand-writing physics/collision/particles\n`
    );
    logs.push('✅ Updated knowledge/KNOWLEDGE.md quick reference');
    return logs;
  },

  zzfx: async () => {
    const logs = [];
    const dest = path.join(ROOT, 'templates', 'zzfx.min.js');
    logs.push('📥 Downloading ZzFXMicro.min.js from jsDelivr CDN...');
    await downloadFile(
      'https://cdn.jsdelivr.net/gh/KilledByAPixel/ZzFX@master/ZzFXMicro.min.js',
      dest
    );
    const size = fs.statSync(dest).size;
    logs.push(`✅ Downloaded zzfx.min.js (${size} bytes!) → templates/zzfx.min.js`);

    appendIfMissing(
      path.join(ROOT, 'agents', 'AGENT_INSTRUCTIONS.md'),
      'ZzFX INTEGRATED',
      `## ZzFX INTEGRATED ✅\nAll new games MUST use ZzFX for sound effects instead of raw Web Audio beep().\nAdd to every new game: <script src="../../templates/zzfx.min.js"></script>\nDesign sounds at: https://killedbyapixel.github.io/ZzFX/\nUsage: zzfx(...[2,,261,.01,.06,.26,1,.7]) — paste the array from the designer.\n`
    );
    logs.push('✅ Updated agents/AGENT_INSTRUCTIONS.md — Dev Agent will use ZzFX for all future games');

    appendIfMissing(
      path.join(ROOT, 'knowledge', 'techniques', 'audio.md'),
      'ZzFX integrated',
      `\n## ZzFX Integrated ✅\nUse ZzFX for all sound effects. Designer: https://killedbyapixel.github.io/ZzFX/\n\`\`\`html\n<script src="../../templates/zzfx.min.js"></script>\n\`\`\`\nDesign your sound, copy the parameter array, paste as: zzfx(...array)\n`
    );
    logs.push('✅ Updated knowledge/techniques/audio.md with ZzFX workflow');
    return logs;
  },

  zzfxm: async () => {
    const logs = [];
    const dest = path.join(ROOT, 'templates', 'zzfxm.min.js');
    logs.push('📥 Downloading ZzFXM player from jsDelivr CDN...');
    await downloadFile(
      'https://cdn.jsdelivr.net/gh/keithclark/ZzFXM@master/zzfxm.min.js',
      dest
    );
    const size = Math.round(fs.statSync(dest).size / 1024 * 100) / 100;
    logs.push(`✅ Downloaded zzfxm.min.js (${size}kb) → templates/zzfxm.min.js`);

    appendIfMissing(
      path.join(ROOT, 'agents', 'AGENT_INSTRUCTIONS.md'),
      'ZzFXM INTEGRATED',
      `## ZzFXM INTEGRATED ✅\nAll new games CAN include background music via ZzFXM.\nAdd after ZzFX script: <script src="../../templates/zzfxm.min.js"></script>\nCompose music at: https://notecraft.fun (exports ZzFXM format)\nLoop: const music = zzfxm(song); music[0].loop=true;\n`
    );
    logs.push('✅ Updated agents/AGENT_INSTRUCTIONS.md with ZzFXM music instructions');
    return logs;
  },

  playwright: async () => {
    const logs = [];
    logs.push('📥 Installing Playwright via npm...');
    try {
      execSync('npm install --save-dev playwright', { cwd: ROOT, stdio: 'pipe' });
      logs.push('✅ npm install playwright complete');
      execSync('npx playwright install chromium', { cwd: ROOT, stdio: 'pipe' });
      logs.push('✅ Playwright Chromium browser downloaded');
    } catch(e) {
      logs.push('⚠ npm install ran with warnings — Playwright may need manual install');
    }

    // Create a base QA test file
    const testDir = path.join(ROOT, 'tests');
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir);
    const testFile = path.join(testDir, 'game-qa.spec.js');
    if (!fs.existsSync(testFile)) {
      fs.writeFileSync(testFile, `// Game QA test template — generated by Tool Scout
const { test, expect } = require('@playwright/test');

test('game loads and title screen renders', async ({ page }) => {
  await page.goto('http://localhost:3456/index.html');
  await page.waitForTimeout(1000);
  const canvas = await page.$('canvas');
  expect(canvas).toBeTruthy();
});

test('game starts on click', async ({ page }) => {
  await page.goto('http://localhost:3456/index.html');
  await page.waitForTimeout(500);
  await page.click('canvas');
  await page.waitForTimeout(500);
  // State should be PLAY (1) after click
  const state = await page.evaluate(() => window.state);
  expect(state).toBe(1);
});
`);
      logs.push('✅ Created tests/game-qa.spec.js — base test template for all games');
    }

    // Add test script to package.json
    const pkg = readJSON('package.json');
    if (!pkg.scripts) pkg.scripts = {};
    pkg.scripts['test:qa'] = 'playwright test tests/game-qa.spec.js';
    writeJSON('package.json', pkg);
    logs.push('✅ Added "test:qa" script to package.json');

    appendIfMissing(
      path.join(ROOT, 'agents', 'qa-agent-instructions.md'),
      'Playwright INTEGRATED',
      `\n## Playwright INTEGRATED ✅\nReal browser testing now available. Run: npm run test:qa\nTest files live in tests/ folder. Base template: tests/game-qa.spec.js\nFor each new game, create tests/{game-id}.spec.js extending the base template.\n`
    );
    logs.push('✅ Updated qa-agent-instructions.md with Playwright workflow');
    return logs;
  },

  piskel: async () => {
    // Piskel needs a build step — we instead link to the hosted version
    const logs = [];
    logs.push('ℹ Piskel requires a full build step — linking to online version instead');

    appendIfMissing(
      path.join(ROOT, 'agents', 'AGENT_INSTRUCTIONS.md'),
      'Piskel AVAILABLE',
      `## Piskel AVAILABLE ✅\nUse Piskel online editor for designing pixel art sprites: https://www.piskelapp.com\nExport sprites as PNG → describe the pixel data for the Dev Agent to convert to string arrays.\nAlternatively use the in-browser version embedded at https://www.piskelapp.com/p/create/frame\n`
    );

    // Add a quick-link in the dashboard bat area
    const launcherPath = path.join(ROOT, 'OPEN SPRITE EDITOR.bat');
    fs.writeFileSync(launcherPath,
      `@echo off\necho Opening Piskel Sprite Editor...\nstart "" "https://www.piskelapp.com/p/create/frame"\n`
    );
    logs.push('✅ Created OPEN SPRITE EDITOR.bat — opens Piskel in browser');
    logs.push('✅ Updated agent instructions with Piskel workflow');
    return logs;
  }
};

// ── POST /api/tool/approve/:id ────────────────────────────────
// ACTUALLY downloads + integrates the tool immediately
app.post('/api/tool/approve/:id', async (req, res) => {
  const data  = readJSON('pipeline/tool-suggestions.json');
  const tool  = data.tools.find(t => t.id === req.params.id);
  if (!tool) return res.status(404).json({ error: 'Tool not found' });

  tool.status     = 'approved';
  tool.approvedAt = new Date().toISOString();
  writeJSON('pipeline/tool-suggestions.json', data);

  // Update state immediately so dashboard shows "integrating"
  const state = readJSON('pipeline/state.json');
  logActivity(state, '🔧', `Integrating: ${tool.name}`, 'Downloading and applying tool now...');
  // Set Tool Scout agent to active
  const tsAgent = state.agents.find(a => a.id === 'toolscout');
  if (tsAgent) { tsAgent.status = 'active'; tsAgent.currentTask = `Integrating ${tool.name}...`; }
  writeJSON('pipeline/state.json', state);

  // Run the integration handler (if one exists)
  const handler = INTEGRATIONS[tool.id];
  let integrationLogs = [];
  let integrationError = null;

  if (handler) {
    try {
      integrationLogs = await handler();
    } catch(err) {
      integrationError = err.message;
      integrationLogs.push(`❌ Integration error: ${err.message}`);
    }
  } else {
    integrationLogs.push(`ℹ No automated integration for ${tool.name} — marked approved for manual setup`);
  }

  // Mark as integrated (or approved-with-error)
  const finalState = integrationError ? 'approved' : 'integrated';
  tool.status = finalState;
  tool.integrationNotes = integrationLogs.join('\n');
  writeJSON('pipeline/tool-suggestions.json', data);

  // Final state log
  const state2 = readJSON('pipeline/state.json');
  if (integrationError) {
    logActivity(state2, '⚠', `Tool integration issue: ${tool.name}`, integrationError);
  } else {
    logActivity(state2, '🔧', `Tool INTEGRATED: ${tool.name}`, integrationLogs[integrationLogs.length - 1] || 'Done');
  }
  if (tsAgent) { tsAgent.status = 'idle'; tsAgent.currentTask = `${tool.name} integrated ✓`; }
  writeJSON('pipeline/state.json', state2);

  // Git commit the changes
  try {
    execSync('git add -A && git commit -m "Tool Scout: integrated ' + tool.name + '"', { cwd: ROOT, stdio: 'pipe' });
    execSync('git push', { cwd: ROOT, stdio: 'pipe' });
    integrationLogs.push('✅ Changes committed and pushed to GitHub');
  } catch(e) { /* git errors are non-fatal */ }

  res.json({ ok: true, tool, logs: integrationLogs, error: integrationError });
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
