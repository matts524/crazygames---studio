# Research: Stack Master

## Market Analysis
- **Genre:** Hypercasual arcade / timing
- **CrazyGames fit:** HIGH — one-tap, instant comprehension, no tutorial needed
- **Trending:** Stacking + timing mechanics in top-10 hypercasual mechanics (2025)
- **Similar:** Stack (Ketchapp), Tower Stack, Helix Jump, Stack Jump
- **Differentiator:** Pendulum physics (more satisfying than linear swing), perfect-stack bonus tower

## Why Stacking Games Dominate
1. **One rule** — drop the block, try to land it perfectly
2. **Self-punishing** — overhang gets cut instantly, player sees their mistake
3. **Escalating tension** — as tower grows, blocks shrink, harder to land
4. **"Perfect" moments** — landing perfectly triggers dopamine spike
5. **Session length** — naturally 2-5 min, replay immediately

## LittleJS Fit — Excellent
- Pendulum motion = `Math.sin(time * speed)` — trivial in LittleJS with `time` global
- Block physics = `EngineObject` with mass=0 (static) — perfect
- Stack collision = position comparison, no actual physics collision needed
- Particles on perfect = LittleJS `ParticleEmitter` out of box
- ZzFX sounds = `new Sound([...])` for drop, cut, perfect, game over

## Technical Approach
- Pendulum block swings using `Math.sin(time)` — no physics, pure math
- When dropped: compare X position with top of stack
- Overhang = amount outside stack width → cut that off (shrink block)
- Perfect = within 2px tolerance → bonus + flash + gold particles
- Tower scrolls up as it grows (camera tracks)
- Block width starts 8 units, shrinks by overhang each drop
- Game over when block width < 0.5 units

## CrazyGames Category: Arcade
## Estimated build: 2-3 hours
