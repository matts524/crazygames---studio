# Game Design: Stack Master

## Core Loop
1. Block swings left↔right on a pendulum arc above the stack
2. Tap/Space to drop it
3. Overhang gets cut off — block shrinks
4. Perfect land (≤2px tolerance) = full width kept + gold flash + bonus points
5. Repeat — tower grows, camera scrolls up, speed increases
6. Game over when block width < 0.5 units (too thin to continue)

## LittleJS Implementation Plan
- `time` global drives pendulum: `blockX = stackCenterX + Math.sin(time * swingSpeed) * swingRange`
- `swingSpeed` starts 1.5, increases by 0.08 every 5 blocks, max 3.5
- `swingRange` starts 4 units, shrinks by 0.1 every 5 blocks, min 1.5
- Each block = `EngineObject` with `mass=0` (kinematic), no gravity
- Camera: `cameraPos.y` lerps to follow top of stack

## Block System
- Block height: 0.6 units (fixed)
- Block width: starts 7 units, reduced by overhang each drop
- Stack bottom at Y = -5
- New block spawns 3 units above top of stack
- Color sequence: cycles through 6 pastel shades

## Scoring
- Normal drop: +10 per block
- Perfect (≤2px): +25 + streak multiplier
- Streak multiplier: 1x → 2x → 3x → 4x (resets on non-perfect)
- Height bonus: +1 per block height (shown at game over)

## Visual Style: Minimalist
- Background: deep dark grey `#0a0a0f` → fades to slightly lighter at top
- Blocks: 6 colours cycling (soft pastels, each slightly glowing)
- Shadow under each block: small dark rect offset slightly
- Perfect flash: gold burst particles + brief white outline on block
- Stack trail: previous 3 blocks visible above and below screen edge

## Screens
1. **Title:** "STACK MASTER", animated demo block swinging, "TAP TO START"
2. **Gameplay:** score top-centre, height top-right, streak indicator
3. **Perfect!** text burst when perfect land (fades after 0.5s)
4. **Game Over:** final score, height reached, best score, "TAP TO RETRY"

## Sounds (ZzFX via LittleJS `new Sound()`)
- Drop normal: short thud `[1,,120,.01,.05,.05,4,0]`
- Drop perfect: bright chime `[1.5,,880,.01,.05,.1,1,2]`
- Cut off: quick snip `[.5,,400,.01,.02,.05,3,3]`
- Game over: descending `[1,,300,.1,.2,.5,4,.5]`
- Streak up: ascending pip `[1,,600,.01,.03,.05,1,3]`
