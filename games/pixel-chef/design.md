# Game Design: Pixel Chef Rush

## Core Loop
1. Order appears at top with picture + name + timer bar
2. Player clicks ingredient stations (bottom row) to add to active plate
3. Ingredients stack on plate (visible in centre)
4. Click SERVE when plate matches order → coins + score
5. Wrong combo or expired timer → lose a heart
6. 3 hearts total. Game over when all lost.

## Layout (400×580 canvas)
```
┌─────────────────────────────────────────┐
│  ❤❤❤   PIXEL CHEF RUSH    Score: 0     │  ← HUD bar (40px)
├─────────────────────────────────────────┤
│  [Order 1 ⏱]  [Order 2 ⏱]  [Order 3 ⏱] │  ← Order queue (100px)
├─────────────────────────────────────────┤
│                                         │
│         🍽 ACTIVE PLATE                │  ← Plate area (200px)
│      (shows ingredients added)          │
│                                         │
├─────────────────────────────────────────┤
│ [🍞] [🥩] [🍚] [🐟] [🍦] │  [SERVE] │  ← Ingredient stations (80px)
│  Bun  Patty Rice  Fish  Scoop  ↑        │
│                              Serve btn  │
└─────────────────────────────────────────┘
```

## Recipes (10 total, unlocked progressively)
| Name | Ingredients (in order) | Unlocked at level |
|------|------------------------|-------------------|
| Classic Burger | Bun + Patty | 1 |
| Fish Taco | Rice + Fish | 1 |
| Ice Cream Surprise | Scoop + Bun | 2 |
| Sushi Stack | Rice + Fish + Rice | 2 |
| The Meatwich | Patty + Patty + Bun | 3 |
| Frozen Burger | Bun + Patty + Scoop | 3 |
| Rainbow Roll | Fish + Scoop + Rice | 4 |
| Double Trouble | Patty + Bun + Patty | 4 |
| The Mistake | Rice + Patty + Fish + Scoop | 5 |
| Chef's Madness | Bun + Fish + Scoop + Patty | 5 |

## Ingredient Stations (pixel art, 56×56 each)
| Station | Colour | Pixel Icon |
|---------|--------|------------|
| Bun     | #d4a56a | Round top half |
| Patty   | #8b4513 | Rectangle |
| Rice    | #f5f5dc | Small dots grid |
| Fish    | #87ceeb | Fish shape |
| Ice Cream | #ffc0cb | Triangle + circle |

## Plate Display
- Centre of screen, large area (160×160)
- Each ingredient stacks as a pixel block from bottom up
- Max 4 ingredients visible
- Plate wobbles when wrong ingredient added (CSS transform)

## Order Cards
- 80×90px each, up to 3 simultaneously
- Shows: dish name (pixel font), ingredient icons stacked, timer bar (depletes red→green)
- Timer: 12s level 1 → 7s level 5
- Active (being worked on) card glows yellow

## Difficulty Progression (every 5 orders = new level)
| Level | Simultaneous orders | Timer | Recipes available |
|-------|--------------------|----|---------|
| 1 | 1 | 12s | 2 |
| 2 | 2 | 10s | 4 |
| 3 | 2 | 9s | 6 |
| 4 | 3 | 8s | 8 |
| 5+ | 3 | 7s | 10 |

## Visual Style (Pixel Art)
- Canvas 400×580, `imageSmoothingEnabled = false`
- All drawing with `fillRect` — no images
- Palette: kitchen bg `#2d1b0e`, counter `#8b6914`, tile floor `#c4a35a` / `#b8943c`
- Text: white with 1px black shadow, monospace font
- Animations: ingredient "pop" scale 1→1.3→1 on click (20 frames)

## Audio (Web Audio API)
- Ingredient click: short "pop" (sine, 440Hz, 60ms)
- Correct order: happy chime (C-E-G arpeggio, 150ms each)
- Wrong order: buzzer (sawtooth, 200Hz, 300ms)
- Order expired: descending tone (880→440Hz)
- Level up: fanfare (ascending 5 notes)

## Screens
1. **Title:** "PIXEL CHEF RUSH", pixel art chef character, TAP TO START, best score
2. **Gameplay:** HUD + order queue + kitchen + stations
3. **Level Up:** "LEVEL 2!" flash overlay (1.5s then auto-dismiss)
4. **Game Over:** Score, best score, orders completed, star rating (1-3 stars), PLAY AGAIN
