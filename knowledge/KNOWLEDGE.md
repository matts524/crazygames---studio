# Game Studio Knowledge Base

This is the studio's living memory. Every agent reads this before working.
Every reflexion round writes new lessons here. The studio gets smarter with every game.

**Last updated:** 2026-06-05  
**Games built:** 2  
**Knowledge entries:** 19  
**Research runs:** 1

---

## Index

- [techniques/pixel-art.md](techniques/pixel-art.md) — Pixel art drawing, animation, sprite systems
- [techniques/game-feel.md](techniques/game-feel.md) — Juice, feedback, screen shake, particles
- [techniques/audio.md](techniques/audio.md) — Web Audio API patterns that work
- [techniques/performance.md](techniques/performance.md) — Canvas optimisation tricks
- [lessons/per-game.md](lessons/per-game.md) — What we learned from each shipped game
- [research/crazygames-trends.md](research/crazygames-trends.md) — Current platform trends
- [research/mechanics.md](research/mechanics.md) — Game mechanic research log

---

## Quick Reference — Most Impactful Lessons

These are the highest-ROI things the Dev Agent must apply to every game:

1. **Always initialise stars/particles BEFORE the game loop starts** — not inside init(). (Gravity Flipper bug: title screen was black)
2. **Add graceTimer on game start** — player needs 1-2 seconds before physics kicks in or they die before playing
3. **Green glow on plate/target when combo matches** — biggest clarity win in Pixel Chef Rush (+0.5 score)
4. **Screen shake on every failure** — shake=5,frames=10 is the sweet spot. Too little feels unresponsive, too much is nauseating
5. **Streak/combo system** — adds engagement hook for FREE. Always include some form of consecutive-correct bonus
6. **Urgent timer pulse (red, sin wave)** — players miss expiry without it. Critical for any timed mechanic
7. **pauseLoop/resumeLoop hooks** — required in every game for QA agent to function
8. **CrazyGames SDK gameplayStart/Stop** — call at game start and death, not just init
13. **LittleJS INTEGRATED** ✅ — `templates/littlejs.min.js` — use `engineInit()` + `EngineObject`. ⚠ NEVER pass `undefined` as 6th param — use `setCanvasClearColor()` first, then `engineInit()` with 5 params.
14. **ZzFX INTEGRATED** ✅ — `templates/zzfx.min.js` (1.2kb) — design sounds at https://killedbyapixel.github.io/ZzFX/ then paste array. If using LittleJS, use `new Sound([...])` instead (built-in). — `templates/littlejs.min.js` — use `engineInit()` + `EngineObject` instead of hand-writing physics. Saves ~300 lines per game. See AGENT_INSTRUCTIONS.md for full API.
9. **Idle animation** — just shift body 1px down on frame 2 at 500ms per frame. Looks alive instantly.
10. **Walk cycle** — 4 frames: contact (foot fwd, body DOWN 1px) → passing (feet together, body UP 1px) → mirror → passing. NOT a bounce — the UP happens when feet are together.
11. **Hold important animation frames longer** — strike/impact hold = 150–200ms, movement frames = 80ms. Never uniform FPS.
12. **Smear frames for fast actions** — draw a 2px colour streak in motion direction instead of exact position. Reads as speed for free.
