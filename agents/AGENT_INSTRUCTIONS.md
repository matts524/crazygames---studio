# Autonomous Game Studio — Agent Instructions

This file defines how each agent operates within the pipeline. Claude reads this when running an autonomous cycle.

## Pipeline Stages

1. **idea** → Agent picks top-priority idea from queue.json `ideas[]`
2. **research** → Agent researches: similar games, mechanics, CrazyGames trends, what makes it fun
3. **design** → Agent writes game design doc: core loop, controls, art style, win/lose conditions
4. **build** → Agent writes the complete single-file HTML5 game (self-contained, no external deps)
5. **qa** → Agent plays through the game mentally, checks for bugs, polishes, marks as shipped

## ✅ INTEGRATED TOOLS (mandatory — use in every new game)

### 🎮 LittleJS — INTEGRATED
**File:** `templates/littlejs.min.js` (175kb, downloaded 2026-06-05)
**Docs:** https://github.com/KilledByAPixel/LittleJS
**CDN fallback:** https://cdn.jsdelivr.net/gh/KilledByAPixel/LittleJS@main/dist/littlejs.min.js

Every new game MUST include LittleJS instead of hand-writing engine code:
```html
<script src="../../templates/littlejs.min.js"></script>
```

**What LittleJS provides (do NOT re-implement these):**
- `vec2(x,y)` — 2D vector math
- `drawRect(pos, size, color)` — draw rectangles
- `drawTile(pos, size, tileIndex)` — draw sprites from tilemap
- `drawText(text, pos, size, color)` — pixel text rendering
- `new Sound([...])` / `sound.play()` — audio via ZzFX (built-in!)
- `keyIsDown(key)` / `mouseIsDown(0)` — input handling
- `gamepadIsDown(button)` — gamepad support
- `new ParticleEmitter(pos, ...)` — particle system
- `TileLayerData` + `TileLayer` — tilemap collision
- `engineInit(mainInit, mainUpdate, mainUpdatePost, mainRender)` — game loop
- `cameraPos`, `cameraScale` — camera control
- `vec2(canvas.width, canvas.height)` → use `mainCanvasSize` instead

**Standard LittleJS game structure:**
```javascript
// Add after <script src="../../templates/littlejs.min.js"></script>
function gameInit() {
  // called once on startup — load assets, set up level
}
function gameUpdate() {
  // called every frame — update game logic
}
function gameUpdatePost() {
  // called after physics — UI updates
}
function gameRender() {
  // called every frame — draw background/world
}
function gameRenderPost() {
  // called after objects render — draw HUD overlay
}
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);
```

**Object system:**
```javascript
class Player extends EngineObject {
  constructor(pos) {
    super(pos, vec2(1));  // pos, size
    this.setCollision(true, false); // solid, isTrigger
  }
  update() {
    super.update(); // apply physics
    if (keyIsDown('ArrowRight')) this.velocity.x += 0.1;
    if (keyIsDown('Space') && this.groundObject) this.velocity.y = 0.3;
  }
  render() {
    drawRect(this.pos, this.size, new Color(0,0.5,1)); // blue square
  }
}
```

---

## Other Approved Tools (check before every build)

Other tools tracked in `pipeline/tool-suggestions.json`:
- **ZzFX** → if integrated: use for sound effects
- **ZzFXM** → if integrated: add background music
- **Playwright** → if integrated: QA Agent uses browser tests
- **Piskel** → if integrated: use for sprite design

---

## CrazyGames Requirements (always follow)
- Single HTML file, self-contained (no CDN, no external assets unless fonts)
- Mobile-friendly (touch controls)
- Loads in under 3 seconds
- Works in iframe
- No login required
- Fun in first 30 seconds
- Clear win/lose state or endless with score
- Keyboard AND mouse/touch support

## Game Build Rules
- Pure HTML/CSS/JS only — no frameworks, no build tools
- Canvas-based OR DOM-based (whichever fits better)
- Include: title screen, gameplay, game over screen with score + restart
- Sound: use Web Audio API for simple beeps/tones (no audio files needed)
- Art: use CSS shapes, emoji, or canvas primitives — pixel art via canvas is great
- Target: 300-600 lines of clean, commented JS

## QA Compatibility (mandatory for all games)
All canvas games MUST include this at the end of the script, just before the game loop starts:
```js
let _rafId;
function _loop(ts) { _rafId = requestAnimationFrame(_loop); lastTime = ts || lastTime; update(16.67); draw(); }
window.pauseLoop  = () => { cancelAnimationFrame(_rafId); draw(); };
window.resumeLoop = () => { _rafId = requestAnimationFrame(_loop); };
_rafId = requestAnimationFrame(ts => { lastTime = ts; _rafId = requestAnimationFrame(_loop); });
```
This allows the QA Agent to call `window.pauseLoop()` before taking screenshots.

## Output Files Per Game
Each game lives in: `games/{game-id}/`
- `game.html` — the playable game
- `design.md` — game design document
- `research.md` — research notes
- `screenshot.md` — description of what a screenshot would look like

## State Updates
After each agent action, update:
1. `pipeline/queue.json` — move game to correct array, update status/progress
2. `pipeline/state.json` — update agent status + append to activityLog

## Activity Log Format
```json
{ "time": "HH:MM", "icon": "💡", "msg": "Short message", "detail": "optional detail" }
```
Icons: 💡 idea, 🔬 research, 🎨 design, ⚙️ build, 🧪 qa, ✅ done, 🚀 shipped, ❌ error
