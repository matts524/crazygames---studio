# Research: Pixel Chef Rush

## Market Analysis
- **Genre:** Casual cooking / time-management
- **CrazyGames tier:** Tier 1 Casual — very high traffic, broad audience
- **Similar games:** Cooking Mama, Overcooked, Good Pizza Great Pizza, Diner Dash
- **Key insight:** Cooking games dominate mobile casual — simple tap interactions, visual rewards, cute art = viral

## What Makes Cooking Games Work
1. **Clear visual order** — player sees exactly what to make (picture of dish)
2. **Satisfying tap/click** — each action has a pop of feedback
3. **Time pressure** — creates urgency without frustration if tuned right
4. **Escalation** — more orders, faster timers, new ingredients keeps it fresh
5. **Pixel art + cooking** = instant nostalgia appeal, performs well on CrazyGames thumbnails

## Differentiation: Absurd Recipe Combos
- Normal game: Burger = bun + patty + lettuce
- Our game: "Sushi Burger" = bun + rice + fish | "Ice Cream Ramen" = noodles + scoop + sauce
- Orders have funny names shown to player — humor drives shareability
- As levels progress, recipes get increasingly surreal

## CrazyGames Fit
- Mobile-first: tap stations to interact ✓
- Session length: 2-5 mins per run ✓
- No tutorial needed: first order teaches mechanic ✓
- Replayability: high score + level progression ✓
- Thumbnail: colourful pixel kitchen = very clickable ✓

## Technical Approach
- Canvas-based, pixel art style (draw with fillRect at pixel scale)
- 5 ingredient stations + 1 serve counter
- Orders queue at top (max 3 simultaneous)
- Click station → ingredient added to plate in progress
- Click serve when plate matches order
- Web Audio: satisfying "pop" sounds per interaction
