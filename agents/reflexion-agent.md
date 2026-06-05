# Reflexion Agent

Runs after QA passes. Plays the game, critiques it across 5 dimensions, scores
improvements by impact vs effort, implements the top picks, then loops.
Maximum 3 rounds per game. Stops early if quality score reaches 9/10.

---

## When to Run

Master Agent triggers Reflexion when:
- Game status is `"qa"` (QA just passed)
- `reflexionCount` < 3
- `reflexionComplete` is not true

After each round: run QA again. If QA still passes → increment reflexionCount → loop.
If QA fails after a reflexion change → Dev Agent fixes the regression first.

---

## Round Structure

### Step 1 — Play the Game (eval-based simulation)
Use preview tools to load the game and run through it:

```js
// Load game, start it, simulate interactions, observe
handleInput();           // start
// simulate core actions for this game type
// observe: state changes, score, deaths, visual feedback
```

Observe and note:
- Does the game feel good to play? (responsive, satisfying)
- Is anything confusing on first play?
- Does difficulty feel right?
- Are there any dead moments (nothing happening)?
- Does anything look rough or unfinished?

### Step 2 — Score the Game (before changes)
Rate the game 1–10 across 5 dimensions:

| Dimension | What to assess | Max |
|-----------|---------------|-----|
| **Visual Polish** | Art consistency, animations, colour harmony, UI clarity | 2 |
| **Game Feel** | Feedback on every action, screen shake, particles, sound | 2 |
| **Engagement Hook** | Score incentive, progression, "one more go" pull | 2 |
| **Clarity** | Instructions obvious, win/lose clear, controls intuitive | 2 |
| **Fun Factor** | Is it genuinely enjoyable? Would you play it again? | 2 |

Total = sum. Stop loop early if total ≥ 9.

### Step 3 — Generate Improvement Candidates
List every possible improvement you can think of. For each, assign:
- **Impact** 1–5: how much it improves player experience
- **Effort** 1–5: how complex to implement (1=trivial, 5=major rewrite)  
- **Priority** = Impact ÷ Effort (higher = do first)
- **Risk** LOW/MED/HIGH: chance of breaking existing functionality

Format:
```
| Improvement | Impact | Effort | Priority | Risk |
|-------------|--------|--------|----------|------|
| Add combo multiplier for consecutive correct orders | 4 | 2 | 2.0 | LOW |
| Screen shake on wrong order | 3 | 1 | 3.0 | LOW |
| Flash order card red when timer < 3s | 3 | 1 | 3.0 | LOW |
| Coin animation flying to score counter | 4 | 2 | 2.0 | LOW |
```

### Step 4 — Select & Implement
Pick the **top 3 by Priority** where Risk is LOW or MED.
**Never pick anything with Risk=HIGH in rounds 1–2. Round 3 only if score < 7.**

Implement each change directly in the game's `index.html`.
After each individual change, do a quick sanity check:
- Does the game still start? (`state` transitions correctly)
- Does the changed feature work as intended?

### Step 5 — Write Reflexion Report
Save to `pipeline/reflexion/{game-id}-round-{n}.json`:

```json
{
  "gameId": "pixel-chef",
  "round": 1,
  "scoreBefore": { "visual": 1.2, "feel": 1.0, "engagement": 1.2, "clarity": 1.5, "fun": 1.4, "total": 6.3 },
  "scoreAfter":  { "visual": 1.6, "feel": 1.6, "engagement": 1.5, "clarity": 1.5, "fun": 1.7, "total": 7.9 },
  "improvements": [
    { "title": "Screen shake on wrong order", "impact": 3, "effort": 1, "implemented": true },
    { "title": "Timer flashes red when < 3s",  "impact": 3, "effort": 1, "implemented": true },
    { "title": "Coin pop animation to score",  "impact": 4, "effort": 2, "implemented": true }
  ],
  "skipped": [
    { "title": "Combo multiplier", "reason": "Saved for round 2" }
  ],
  "notes": "Game feel improved significantly. Clarity still needs work — order matching not obvious enough."
}
```

### Step 6 — Update Pipeline
Update game in `queue.json`:
- `reflexionCount`: increment
- `status`: back to `"build"` (so QA runs again)
- `lastReflexionScore`: the new total score
- If `reflexionCount` reaches 3 OR score ≥ 9: set `reflexionComplete: true`, `status: "qa"`

Update `state.json` activity log with round results.

---

## Improvement Catalogue (by category)

Use this as a checklist when generating candidates:

### Visual Polish
- [ ] Consistent colour palette throughout (no mismatched greys)
- [ ] Smooth animations on all interactive elements (easing, not snap)
- [ ] Particle effects on every significant event (score, death, level up)
- [ ] Background has depth (subtle patterns, gradient, parallax)
- [ ] UI elements have clear visual hierarchy (title > score > labels)
- [ ] Game over screen feels dramatic (not just text on black)
- [ ] Ingredient/character sprites are recognisable and charming
- [ ] Numbers animate when they change (score counter)

### Game Feel ("Juice")
- [ ] Screen shake on death / big hit
- [ ] Hit-stop / brief freeze on impact (2–4 frames)
- [ ] Every button/station click has instant visual response
- [ ] Sound on EVERY meaningful action (not just some)
- [ ] Camera zoom or flash on level up
- [ ] Wrong action gives clear negative feedback (red flash + sound)
- [ ] Correct action gives clear positive feedback (green flash + sound)
- [ ] Objects have slight squash/stretch on interaction

### Engagement Hooks
- [ ] Combo multiplier (consecutive perfect orders)
- [ ] Streak counter (X in a row without mistakes)
- [ ] Star rating shown on game over (1–3 stars by score threshold)
- [ ] "Personal best" celebration if new high score
- [ ] Daily challenge concept (same seed each day)
- [ ] Speed bonus (serve before half the timer = bonus coins)
- [ ] Perfect round bonus (complete level without mistakes)
- [ ] Visual progression (kitchen upgrades as levels increase)

### Clarity Improvements
- [ ] On-screen instruction on first play (one sentence, auto-dismisses)
- [ ] Active order highlighted more clearly
- [ ] Wrong ingredients show a brief "X" indicator on the station
- [ ] Plate shows a "✓" or "?" indicating if current combo is valid
- [ ] Keyboard shortcut hints shown on stations (1–5 keys)
- [ ] Score breakdown on game over (base + bonuses)

### Fun Factor
- [ ] More recipe variety (double the variety by level 3)
- [ ] Surprise "RUSH HOUR" event (2x orders for 10 seconds)
- [ ] Random "special order" with huge bonus
- [ ] Funny recipe names shown prominently
- [ ] Chef character reacts to events (happy/sad face)

---

## Reflexion History on Dashboard

The dashboard shows a "Reflexion" section per game with:
- Round number (1/2/3)
- Score before → after
- What was improved
- "Round complete" or "Max rounds reached"
