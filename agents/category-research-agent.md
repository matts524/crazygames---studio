# Category Research Agent

Runs when the Idea Agent needs to generate new ideas or when the Research Agent
is analyzing a specific game concept. Produces genre trend data to make smarter decisions.

---

## CrazyGames Top Categories (as of 2025–2026)

Research findings — update this section each cycle with fresh data.

### 🏆 Tier 1 — Highest traffic, easiest to get featured
| Category    | Why it works                              | Example hits              |
|------------|------------------------------------------|---------------------------|
| Hypercasual | One mechanic, instant play, mobile-first | Flappy Bird clones, runners |
| Puzzle      | High session count, low dev complexity   | 2048, Wordle-likes         |
| Idle/Clicker| Long sessions, return visits             | Cookie Clicker variants    |
| IO Games    | Multiplayer feel, competitive            | Slither.io, agar.io        |

### 🥈 Tier 2 — Good traffic, more competition
| Category    | Notes                                     |
|------------|-------------------------------------------|
| Arcade      | Saturated but timeless — needs a twist    |
| Casual      | Broad appeal, needs polished UI           |
| Word        | Small but loyal audience, easy to ship    |
| Drawing     | Creative/social, hard to do well in HTML  |

### 🥉 Tier 3 — Niche but loyal
| Category    | Notes                                     |
|------------|-------------------------------------------|
| Platformer  | Players expect more content / levels      |
| Tower Defense | Complex to balance                      |
| RPG         | Very long dev time, hard in single HTML   |
| Simulation  | Can work if simple enough (e.g. Tiny Town)|

---

## What Makes a Game Get Featured on CrazyGames

Based on developer documentation and community research:

1. **Unique mechanic** — even a 10% twist on a classic genre helps
2. **Instant play** — no loading bar, start button visible in 2 seconds
3. **Mobile-first** — 65%+ of CrazyGames traffic is mobile
4. **Thumbnail appeal** — bright, colorful, clearly communicates genre
5. **Replayability** — high score, daily challenge, or procedural levels
6. **No paywall** — CrazyGames audience expects 100% free
7. **Clean iframe embed** — no popups, no fullscreen demands on load

---

## CrazyGames SDK (optional but recommended)

The CrazyGames SDK adds:
- `CrazyGames.SDK.ad.requestAd('midgame', callbacks)` — midgame ads (revenue)
- `CrazyGames.SDK.game.gameplayStart()` / `gameplayStop()` — required for ad timing
- `CrazyGames.SDK.user.isUserAccountAvailable` — optional login

**Minimal SDK integration (add to any game):**
```html
<script src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script>
<script>
  // Call at game start
  window.CrazyGames?.SDK?.game?.gameplayStart();
  // Call on game over / pause
  window.CrazyGames?.SDK?.game?.gameplayStop();
  // Optional: midgame ad on death (after 3+ deaths)
  let deathCount = 0;
  function onDeath() {
    deathCount++;
    if (deathCount % 3 === 0) {
      window.CrazyGames?.SDK?.game?.gameplayStop();
      window.CrazyGames?.SDK?.ad?.requestAd('midgame', {
        adFinished: () => window.CrazyGames?.SDK?.game?.gameplayStart(),
        adError:    () => window.CrazyGames?.SDK?.game?.gameplayStart(),
      });
    }
  }
</script>
```

---

## Trend Research Process

When the Research Agent calls on this agent:

1. Check `pipeline/shipped[]` to see what genres are already covered
2. Look at the Tier table above — prioritise underrepresented Tier 1/2 genres
3. Check if current idea matches the genre's success factors
4. Recommend art style based on genre × style table in art-style-agent.md
5. Write findings into `games/{id}/research.md` under "Market Analysis"

## Genre Gap Analysis (current pipeline)

| Genre       | Shipped | In Pipeline | Gap?     |
|------------|---------|-------------|----------|
| Arcade      | ✅ 1    | 1           | Covered  |
| Puzzle      | —       | 2           | Building |
| Casual      | —       | 1           | Building |
| Idle        | —       | 1           | Building |
| Word        | —       | 1           | Building |
| IO / Multi  | —       | —           | ⭐ Gap   |
| Platformer  | —       | —           | Gap      |
| Drawing     | —       | —           | Gap      |
