# Research: Gravity Flipper

## Market Analysis
- **Genre:** Hypercasual endless runner / one-button
- **CrazyGames fit:** HIGH — top category on platform, 2-5 min session ideal
- **Similar games:** Flappy Bird, Geometry Dash, Swing Copter, Duet, VVVVVV

## What Makes These Games Work
1. **Instant comprehension** — player understands mechanic in 2 seconds
2. **Easy to start, hard to master** — first run lasts 5-15 seconds, best run takes days
3. **Rhythm and flow** — obstacles feel musical, not random
4. **One more go** loop — death is instant restart, no friction
5. **Visual feedback** — screen shake, particles, color flash on death

## Gravity Flip Differentiation
- Dual-lane: obstacles come from BOTH top AND bottom simultaneously
- Player is a neon geometric shape (triangle, diamond)
- Flip gravity with spacebar/tap — normal = fall down, flipped = fall up
- Speed increases gradually
- Obstacles: walls with gaps that require correct gravity orientation

## CrazyGames Technical Notes
- Must work in iframe ✓ (no popups, no fullscreen API needed)
- Mobile: tap to flip ✓
- No loading screen needed — canvas starts immediately
- Target 60fps on mid-range phone

## Monetization Notes (for CrazyGames)
- Ad break after every 3 deaths (CrazyGames SDK handles this)
- No in-game purchases needed for basic submission
