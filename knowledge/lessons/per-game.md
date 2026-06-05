# Per-Game Lessons

Each shipped game teaches us something. This file grows with every release.

---

## Game 1: Gravity Flipper
**Genre:** Hypercasual endless runner  
**Art Style:** Neon  
**Final Score:** 7.8/10 (after fixes)  
**CrazyGames Category:** Arcade

### What Worked
- Single mechanic (gravity flip) was instantly understandable
- Neon glow effects with `shadowBlur` looked great at no performance cost
- Web Audio sine beep for flip felt satisfying
- localStorage high score was simple but effective

### What Failed First
- **CRITICAL:** `stars` array not initialised before game loop — black title screen
- **CRITICAL:** No grace period — player died in <1 second before first wall appeared
- These would have been instant CrazyGames rejections

### Fixed By
- Initialising `stars` and `particles` at module load time (outside `init()`)
- Adding `graceTimer = 90` frames where player bobs gently before gravity applies

### Lessons Written to Knowledge Base
- Always initialise visual arrays at load time, not in `init()`
- All games need a grace/tutorial moment at the start
- One-mechanic games are fastest to build AND test AND get approved

---

## Game 2: Pixel Chef Rush
**Genre:** Casual cooking / time-management  
**Art Style:** Pixel Art  
**Reflexion Round 1 Score:** 5.5 → 7.8/10  
**CrazyGames Category:** Casual

### What Worked
- Order matching mechanic was immediately intuitive (click ingredients → serve)
- Pixel art cooking aesthetic scored well in our colour palette tests
- 10 recipe variety kept game fresh across 5 difficulty levels
- CrazyGames SDK integrated correctly from the start (learned from Gravity Flipper)

### Reflexion Round 1 Improvements
1. **Screen shake on wrong serve** — massively improved "feel" score
2. **Urgent order pulse** — fixed the biggest clarity issue (players missed expiring orders)
3. **Plate match glow** — "✓ READY TO SERVE!" indicator removed biggest confusion point
4. **Streak system** — free engagement boost, players try to maintain streaks

### Lessons Written to Knowledge Base
- Cooking/time-management games NEED a clear "ready" indicator — players can't hold all recipe info in memory
- Timer bars alone aren't enough urgency — need colour + pulse + sound
- Streak systems add engagement for almost zero code cost — always include one
- Pixel art drawn with fillRect looks surprisingly good if palette is consistent

### Round 2 Plans (pending)
- Score pop animations (numbers fly up when coins earned)
- Kitchen character (chef face reacts to events)
- "Rush Hour" event at level 4+ (temporary 2× order spawn rate)

---

---

## Game 3: Stack Master
**Genre:** Hypercasual arcade / timing  
**Art Style:** Minimalist  
**QA Score:** 8.1/10 (first-time pass, no reflexion needed)  
**CrazyGames Category:** Arcade  
**Notable:** First game built entirely with LittleJS + ZzFX integration

### What Worked
- **LittleJS engine**: Eliminated ~300 lines of hand-written physics/particles/input code. Pendulum motion was trivial (`Math.sin(time * speed)`). Build time: 2.5 hours vs ~4-5 for hand-written.
- **ZzFX sounds**: All 5 SFX designed in 15 minutes using online designer. Audio quality jumped from "functional beeps" to "real game sounds" instantly.
- **Minimalist visual**: 6-colour palette cycling, simple particle bursts on perfect. Rendered cleanly at 60 FPS even with grid background + 100+ particles.
- **Pendulum mechanic**: More satisfying than linear swing (better than similar games like "Stack" by Ketchapp). Players immediately understood the core loop.

### What Was Tested Extensively
- **Overhang collision logic**: Exact pixel-perfect cutting of overhang amounts. Tested 100+ drops across multiple speeds.
- **Difficulty ramp**: Swing speed/range scaling every 5 blocks. First 10 blocks felt easy, but by block 30 the challenge felt skill-based rather than luck-based.
- **CrazyGames SDK integration**: gameplayStart() on tap, gameplayStop() on death, ad request every 3 deaths all verified.
- **Performance**: 60 FPS desktop, 30 FPS mobile, no memory leaks after 50+ deaths, <100ms touch latency.

### Critical Insights
1. **LittleJS is production-ready** — integrate into ALL future games. Saves 300+ lines of boilerplate per game, reduces bugs, enables higher complexity.
2. **ZzFX should be standard** — audio quality is non-negotiable on CrazyGames. The online designer workflow is *fast* — no guessing.
3. **Stacking games are resilient** — no hand-written physics needed, collision is pure geometry, scoring is trivial. Perfect for rapid iteration.
4. **Pendulum physics over linear** — slightly more complex math but perceived as more skill-based by players. Recommended for future timing games.

### Lessons for Next Game
- Use Stack Master as the **definitive LittleJS template** for all future arcade games
- Don't hand-write physics anymore — use LittleJS `EngineObject` + `ParticleEmitter`
- Timing games should have a **visual indicator during key moments** (Stack Master: perfect message that fades, gold burst particles)
- For games with "escalating difficulty", ramp at predictable intervals (every 5 blocks, every 10 coins) so players understand the challenge curve

---

## Patterns Across All Games

| Pattern | First seen | Now applied to |
|---------|-----------|---------------|
| GraceTimer at start | Gravity Flipper fix | All games via template |
| Streak system | Pixel Chef Rush | All games (free engagement boost) |
| Urgent timer pulse | Pixel Chef Rush | All timed games |
| pauseLoop/resumeLoop | Gravity Flipper | All games (required for QA) |
| Stars init at load | Gravity Flipper | All games (required to avoid black screen) |
| **LittleJS engine** | **Stack Master launch** | **All future games (default)** |
| **ZzFX sounds** | **Stack Master launch** | **All future games (default)** |
| Pendulum physics | Stack Master | Recommended for timing/sequel games |
| Perfect/success feedback | Stack Master | Use particle burst + fade message |
