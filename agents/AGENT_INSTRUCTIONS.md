# Autonomous Game Studio — Agent Instructions

This file defines how each agent operates within the pipeline. Claude reads this when running an autonomous cycle.

## Pipeline Stages

1. **idea** → Agent picks top-priority idea from queue.json `ideas[]`
2. **research** → Agent researches: similar games, mechanics, CrazyGames trends, what makes it fun
3. **design** → Agent writes game design doc: core loop, controls, art style, win/lose conditions
4. **build** → Agent writes the complete single-file HTML5 game (self-contained, no external deps)
5. **qa** → Agent plays through the game mentally, checks for bugs, polishes, marks as shipped

## Approved Tools (check before every build)

Before writing any game code, read `pipeline/tool-suggestions.json` and check for tools with `status: "approved"`.
For each approved tool, apply its integration instructions. Once integrated into a game, you do not need to re-read it for future games — the templates will already include it.

Current tool status is tracked in `pipeline/tool-suggestions.json`. If a tool is approved:
- **LittleJS** → use as game engine instead of hand-written physics/collision
- **ZzFX** → use for all sound effects instead of raw Web Audio beep()
- **ZzFXM** → add background music using the tracker format
- **Playwright** → QA Agent uses browser tests instead of eval() hacks
- **Piskel** → sprite designs can come from the visual editor

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
