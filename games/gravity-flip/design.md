# Game Design: Gravity Flipper

## Core Loop
1. Player spawns in middle of screen, falling downward
2. Tap/Space to flip gravity — player rises instead of falls
3. Walls with vertical gaps scroll left from right edge
4. Player must flip to align with the gap
5. Death = touch top/bottom edge OR miss a gap
6. Score = distance traveled (meters)

## Controls
- **Desktop:** Spacebar or mouse click
- **Mobile:** Tap anywhere on screen
- Single action = flip gravity toggle

## Player
- Shape: glowing diamond/rhombus
- Color: cyan (#06b6d4) with white trail
- Smooth gravity transition (not instant snap) — 300ms ease
- Trail: last 8 positions drawn with fading opacity

## Obstacles (Wall Pairs)
- Two rectangles: one from top, one from bottom
- Gap height starts at 38% of screen height
- Gap position is randomized each wall (within reachable range)
- Walls spawn every 220px (decreasing to 160px at speed level 10)
- Wall width: 22px
- Color: purple/magenta gradient

## Physics
- Gravity acceleration: 0.4 px/frame (increases by 0.01 every 10 seconds)
- Max fall speed: 8 px/frame
- On flip: velocity resets to 0, gravity direction inverts
- Scroll speed: starts at 2.5px/frame, +0.15 every 10s, max 6px/frame

## Scoring
- +1 point per wall passed
- Speed multiplier shown at top
- High score stored in localStorage

## Visual Style
- Background: deep black (#0a0a0f) with subtle star field (50 dots)
- Neon color palette: cyan player, magenta walls, yellow score text
- Screen edge glow: cyan at top/bottom when close to boundary
- Death effect: red flash + screen shake (300ms) + particle burst (12 particles)
- Speed up notification: brief "SPEED UP!" text flash

## Screens
1. **Title:** Game name, best score, "TAP TO START" blinking
2. **Gameplay:** score top-center, speed level top-right
3. **Death:** "GAME OVER", score, best score, "TAP TO RESTART"

## Audio (Web Audio API)
- Flip sound: short sine wave beep (220Hz, 80ms)
- Wall pass: tick (880Hz, 40ms)
- Death: descending chord (400→200Hz, 400ms)
- Speed up: ascending beep (440→880Hz, 200ms)
