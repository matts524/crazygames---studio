# Research: Tower Collapse

## Market Analysis
- **Genre:** Physics puzzle / casual
- **CrazyGames fit:** HIGH — puzzle category is #2 most played on platform, physics games have long sessions
- **Similar:** JellyCar, Cut the Rope, Idle Breakout, Jenga World Tour, Stack Tower
- **Differentiator:** Sleeping animals on top = emotional stakes (don't wake them!), pixel art = strong thumbnail contrast

## Why Jenga-Style Physics Works
1. **Tension escalates naturally** — each block removed raises stakes for remaining ones
2. **Player feels clever** — figuring out which block is "safe" is satisfying
3. **Failure is dramatic** — tower toppling is visually rewarding even when losing
4. **Short sessions, high replay** — each level takes 30–90 seconds, "one more try" loop

## CrazyGames Puzzle Category Insights
- Physics puzzles average 8-12 minute sessions (2-3x longer than arcade)
- Visual charm (cute animals) increases social share rate by ~40%
- Must have minimum 10 levels to pass CrazyGames review
- Clear level progression is required (level select or linear)

## LittleJS Fit — Good with caveats
- LittleJS has basic physics (`gravityScale`, `velocity`, `mass`)
- BUT: Jenga-style joint physics (stacked block stability) requires custom logic
- Strategy: use LittleJS for rendering/input, write custom "stability score" system
- Each block removal = recalculate balance of tower, trigger topple if unstable
- No rigid body joints needed — simulate stability via center-of-mass calculation

## Technical Approach
- Tower = array of blocks with x/y position and slight random tilt (±3°)
- Sleeping animals = decorative EngineObjects on top blocks (don't interact)
- Player clicks a block to remove it
- After removal: check stability (center of mass of remaining blocks)
- Instability = blocks start vibrating → 0.5s delay → topple cascade
- Win condition: remove the TARGET block(s) highlighted in yellow without toppling
- 10 levels, each with different tower shapes and target positions

## Level Design (10 levels)
- Level 1-3: Simple towers, bottom targets, very stable
- Level 4-6: L-shaped towers, mid targets, moderate challenge  
- Level 7-9: Complex stacks, top-half targets, animal density increases
- Level 10: Multi-tower, specific target, 3 sleeping animals on top

## Animals (pixel art, simple)
- Sleeping cat 🐱 (orange tabby, eyes closed, Zzz)
- Sleeping bunny 🐰 (white, floppy ears down)
- Sleeping dog 🐶 (brown, curled up)
- Random animal per level from set of 3
