# Playtest Agent — Instructions

## Role
You run immediately after the Dev Agent builds a game. You load the game in a real browser, play through it, catch bugs, and fix them to a playable state. You own the gap between "code exists" and "game actually works."

## Pipeline position
Build → **Playtest** → QA

---

## Step 1 — Serve the game

The Express server runs at http://localhost:3500. All games are served from there.
Game URL pattern: `http://localhost:3500/games/{game-id}/index.html`

Navigate Chrome to the game URL. Wait 2–3 seconds for LittleJS + SDK to initialise.

---

## Step 2 — Check console immediately

Run this JS after page load:
```js
// Paste into browser console or use Chrome MCP read_console_messages
```

**Red flags (must fix before proceeding):**
- `TypeError: X is not a function` → likely pre-init object bug (see Known Bugs)
- `404` on any script → path is wrong, fix the `src` attribute
- `ReferenceError: X is not defined` → missing variable or wrong LittleJS API call
- LittleJS engine never starts (no canvas created) → `engineInit` hung (see Known Bugs)

**Yellow flags (note, continue):**
- CrazyGames SDK warnings → expected in local dev, not a bug
- Minor deprecation warnings → ignore

---

## Step 3 — Play through the critical path

Test each screen in order. If a screen is broken, fix it before moving on.

### 3a. Title screen
- [ ] Canvas renders (not blank white or black)
- [ ] Game title visible
- [ ] "TAP TO START" or equivalent prompt visible
- [ ] **Click/tap** → advances to next screen (level select OR direct gameplay)

### 3b. Core gameplay
- [ ] Player can interact (click/tap/keys)
- [ ] Game responds to input (something visibly changes)
- [ ] Score / counter increments correctly
- [ ] Difficulty increases or levels progress

### 3c. Win/lose states
- [ ] Win condition triggers (complete an objective)
- [ ] Win screen shows (score, stars, or "NICE!" equivalent)
- [ ] Fail/death triggers (hit an obstacle, miss target, etc.)
- [ ] Fail screen shows ("GAME OVER" or equivalent)
- [ ] Retry works (click → game resets cleanly)

### 3d. Progression
- [ ] After win, next level or new round loads
- [ ] No state bleed (score resets, objects cleared)
- [ ] localStorage save/load works (refresh page → progress kept)

---

## Step 4 — Coordinate system for clicking

LittleJS uses a Y-up world coordinate system. Screen click coordinates differ from world coordinates.

**Formula (canvas rect.top = 0, rect.left = 0):**
```
screenshotX = canvasLeft + worldX * cameraScale + canvas.width/2
screenshotY = canvasTop  + (-worldY) * cameraScale + canvas.height/2
```

**Get exact position via JS:**
```js
const canvas = document.querySelector('canvas');
const rect = canvas.getBoundingClientRect();
const W = canvas.width, H = canvas.height;
// For a world object at (wx, wy):
const sx = rect.x + wx * cameraScale + W/2;
const sy = rect.y + (-wy) * cameraScale + H/2;
// sx, sy are viewport coords. Add browser chrome offset (~16px top) for screenshot coords.
```

**Browser chrome offset:** screenshots are ~16px taller than the viewport at the top. Add 16 to sy for screenshot click coordinates.

---

## Step 5 — Diagnose and fix bugs

### Bug Playbook (most common first)

---

#### BUG-01: `TypeError: k.copy is not a function` at ParticleEmitter
**Symptom:** Block removal / effect triggers but crashes. Win/fail state never fires.
**Cause:** `ParticleEmitter` calls `.copy()` on its Color arguments. `Color` objects created at module level (before `engineInit`) lack this method because LittleJS extends the Color class during `engineInit`.
**Fix:** Remove the ParticleEmitter call entirely OR create Colors inline:
```js
// BROKEN — C_WOOD was created before engineInit
new ParticleEmitter(pos, 0, 0.4, 0.12, 10, PI, C_WOOD, C_WOOD_D, ...);

// FIXED — create Color objects after engineInit inside the game loop
// Simplest fix: just delete the ParticleEmitter line for now
// The game becomes playable; add particles back during Reflexion cycle
```
**Test after fix:** Reload, play through, confirm win/fail screen appears.

---

#### BUG-02: LittleJS engine hangs silently (blank canvas, frame=0)
**Symptom:** Canvas exists but nothing renders. `typeof time` returns `number` but it stays at 0.
**Cause:** `engineInit()` called with `undefined` as 6th parameter (tileset). Triggers internal image load that never resolves.
**Fix:**
```js
// BROKEN
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, undefined);

// FIXED — 5 params only, call setCanvasClearColor BEFORE
setCanvasClearColor(new Color(r, g, b));
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);
```

---

#### BUG-03: Script 404 — `littlejs.min.js` or `zzfx.min.js` not found
**Symptom:** Console shows `404` for a template script. Canvas never created.
**Cause:** Game served from a subfolder server that doesn't have the `templates/` dir accessible.
**Fix:** Always use the main Express server at port 3500, not a subfolder preview server.
```
WRONG: http://localhost:3458/index.html  (subfolder server, no templates/)
RIGHT: http://localhost:3500/games/{id}/index.html  (Express server, serves root)
```

---

#### BUG-04: Win/fail never triggers despite correct play
**Symptom:** Game plays, input registers (moveCount increments), but state never changes.
**Cause A:** Exception thrown mid-function (e.g., BUG-01) aborts execution before the win check.
**Fix A:** Fix the exception first.
**Cause B:** Win check fires but is immediately overridden (e.g., collapse logic runs after win and sets state to FAIL).
**Fix B:** Add `return` after setting `gameState = ST.WIN` to skip further logic in that frame:
```js
// After setting gameState = ST.WIN
sndWin.play();
cgStop();
return; // skip collapse/wobble check on win
```

---

#### BUG-05: Click/tap hits wrong world position
**Symptom:** Clicking visually correct position has no effect; wrong block/object triggered.
**Cause:** Browser chrome (~16px top offset) + viewport height changes between screenshots.
**Fix:** Always recalculate click coordinates dynamically via JS before each test:
```js
const canvas = document.querySelector('canvas');
const rect = canvas.getBoundingClientRect();
const target = blocks.find(b => b.isTarget && !b.removed);
const sx = rect.x + target.x * cameraScale + canvas.width/2;
const sy = rect.y + (-target.y) * cameraScale + canvas.height/2;
// sy is viewport Y. Add ~16px for screenshot Y if needed.
console.log(`Click at (${sx}, ${sy})`);
```

---

#### BUG-06: `rand` or LittleJS globals undefined at module level
**Symptom:** `ReferenceError: rand is not defined` or `vec2 is not a function` during object creation.
**Cause:** LittleJS globals (`rand`, `vec2`, `Color`, etc.) are called before `engineInit` runs.
**Fix:** Move any calls to LittleJS globals inside `gameInit()` or inside the game loop. Module-level constants are fine for plain values; for LittleJS objects, use `gameInit`.

---

#### BUG-07: Level select / menu click doesn't register
**Symptom:** Clicking visually correct button has no effect.
**Cause:** Button hit detection uses LittleJS world coordinates. The click coordinate must match the world-space hit zone, not just the visual position.
**Fix:** Calculate world position → screen position using the formula in Step 4.

---

## Step 6 — Fix attempt limit

- Try up to **3 fix attempts** per bug.
- After each fix: reload page, replay from title, recheck the specific bug.
- If a bug is not fixed after 3 attempts: document it in the playtest report and mark as "KNOWN ISSUE — forward to QA".
- Never ship a game that crashes on the critical path (title → play → win/fail → retry).

---

## Step 7 — Write playtest report

Save to: `pipeline/playtest/{game-id}-playtest.json`

```json
{
  "gameId": "...",
  "playtestDate": "...",
  "playtestAgent": "Playtest Agent v1.0",
  "status": "PASS | PASS_WITH_FIXES | FAIL",
  "bugsFound": [
    {
      "bugId": "BUG-01",
      "description": "ParticleEmitter k.copy crash in removeBlock",
      "fixApplied": "Removed ParticleEmitter call from removeBlock",
      "fixStatus": "RESOLVED",
      "attempts": 1
    }
  ],
  "criticalPathVerified": true,
  "screensVerified": ["title", "levelselect", "gameplay", "win", "fail"],
  "knownIssues": [],
  "readyForQA": true,
  "notes": "..."
}
```

**Status definitions:**
- `PASS` — no bugs found, all screens verified
- `PASS_WITH_FIXES` — bugs found and fixed, game is now playable
- `FAIL` — unfixable bugs remain on critical path, needs Dev Agent revision

---

## Step 8 — Update pipeline state

Update `pipeline/state.json`:
- Set playtest agent status to `idle`
- Set currentTask to `{Game} — PASS_WITH_FIXES ✓` or `FAIL ✗`
- Add activity log entry

---

## Knowledge base additions

After each playtest, if you discovered a new bug pattern not in this file:
1. Add it to the Bug Playbook above (BUG-XX)
2. Add a note to `knowledge/KNOWLEDGE.md` under Quick Reference
3. This file is your memory — keep it sharp
