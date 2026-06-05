# Game Design: Tower Collapse

## Core Loop
1. See a tower of wooden blocks with sleeping animals on top
2. Highlighted block(s) = the ones you must remove
3. Click a block to pull it out
4. Tower checks stability — wobbles if unstable
5. Win: all target blocks removed without toppling
6. Lose: tower falls, animals wake up (fail animation)
7. 3 stars based on: remaining tower height + moves used

## Controls
- **Click/tap a block** to remove it
- Can only remove non-structural blocks (not supporting the whole tower)
- Hovering a block shows a stability preview (block highlights red=danger, yellow=risky, green=safe)

## Stability System (simplified for LittleJS)
- Each block has a `stability` value 0-100
- On removal: recalculate stability of adjacent blocks
- Stability < 20 → block starts wobbling (sin wave oscillation)
- Stability = 0 → collapse cascade triggers
- Collapse: blocks gain velocity downward + random angular velocity, fall to ground

## Visual Style: Pixel Art
- Wooden blocks: warm brown `#c68642` with dark grain lines, slight highlight top
- Background: soft sky blue → pastel green ground
- Animals: 16×16 pixel sprites, distinct silhouettes
- Target block: golden outline + subtle pulsing glow
- Removed block: disappears with small puff of dust particles
- Collapse: blocks tumble with pixelated dust cloud

## Scoring (3-star system)
- 3 stars: remove target(s) in 1 move, tower stays standing
- 2 stars: remove targets in 2-3 moves, tower stays standing
- 1 star: removed targets but tower wobbled significantly (stability went below 30)
- 0 stars: tower toppled (level failed, retry available)

## Levels (10 total)

### Level 1 — "The Easy One"
- 5-block tower, target = bottom-left corner block
- Animals: 1 cat on top
- Expected: 1 move, trivial

### Level 2 — "Wobbly Tower"
- 7-block tower, target = 2nd from bottom
- Animals: 1 bunny
- Expected: 1-2 moves

### Level 3 — "The Sandwich"
- 9-block tower, 3 wide, target = middle of 3rd row
- Animals: 1 cat + 1 bunny
- Expected: 1-2 moves, need to read stability

### Level 4 — "L-Shape"
- L-shaped tower 8 blocks, target on the short arm
- Animals: 1 dog
- Expected: 2-3 moves

### Level 5 — "The Overhang"
- Tower with 3-block overhang on right, target = support block
- Animals: 2 cats
- Expected: 1 move but high risk

### Level 6 — "Jenga Classic"
- 3×1 rows stacked 5 high, target = alternating blocks
- Animals: 1 bunny on top
- Expected: 3 moves

### Level 7 — "Tower Twins"
- Two small towers connected by a bridge block, target = bridge
- Animals: 1 per tower
- Expected: 1 move, triggers avalanche on both

### Level 8 — "The Pyramid"
- Inverted pyramid (wider at top), target = base
- Animals: 3 across the top
- Expected: 1 move, dramatic collapse

### Level 9 — "Animal Hotel"
- Tall narrow tower, animals on multiple floors (not just top)
- 4 animals total, target = specific floor
- Expected: 2 moves without disturbing animal floors

### Level 10 — "The Grand Tower"
- Complex multi-block structure, 3 target blocks scattered through it
- 5 sleeping animals, stars scattered on blocks as bonuses
- Expected: 3-5 moves, requires planning

## Screens
1. **Title:** Tower with sleeping animals, "TAP TO PLAY", animated Zzz bubbles
2. **Level Select:** 10 level buttons with star ratings, locked/unlocked
3. **Gameplay:** Tower centered, level number top-left, star goal top-right
4. **Win:** Confetti, star count revealed, "NEXT LEVEL" button
5. **Fail:** Animals wake up (angry faces), tower rubble, "TRY AGAIN" button

## Sounds (ZzFX via LittleJS new Sound())
- Block remove: woody thud `[1,,200,.01,.05,.1,4,1]`
- Tower wobble: low rumble `[0.5,,80,.01,.1,.3,4,0]`
- Collapse: crash `[1,,300,.05,.2,.5,4,.3]`
- Win: chime fanfare `[1.5,,600,.01,.1,.2,1,3]`
- Animals wake: cartoon squeak `[1,,800,.01,.03,.05,1,5]`
- Star earned: soft ding `[1,,1000,.01,.03,.05,1,2]`
