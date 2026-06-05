# Research Agent

Runs on a separate cadence from the build pipeline — approximately once per 3 games built,
or whenever the Idea Agent asks for trend data before generating new ideas.

The Research Agent's job: go out onto the web, find new techniques and trends,
and write findings into the knowledge base so every future game benefits.

---

## Research Tasks (run in order)

### Task 1 — CrazyGames Trend Check
Fetch: https://www.crazygames.com/new-games
Fetch: https://www.crazygames.com/top-games

Look for:
- Which genres appear most in top 20 new games
- Any new mechanics you haven't seen before
- Visual styles that stand out in thumbnails
- Games with high ratings (4.5+) — what do they have in common

Write findings to: `knowledge/research/crazygames-trends.md`

### Task 2 — Pixel Art Technique Research
Search for recent articles/tutorials on:
- "pixel art character animation tutorial 2024 2025"
- "pixel art walk cycle canvas javascript"
- "HTML5 canvas pixel art game techniques"
- "sprite animation javascript no images"

Extract:
- Any NEW animation techniques not already in `knowledge/techniques/pixel-art.md`
- Code patterns that are cleaner than our current approach
- New palette ideas or colour theory for pixel art

Write NEW findings to: `knowledge/techniques/pixel-art.md` (append section "## Research Update — [date]")

### Task 3 — Game Feel / Juice Research
Search for:
- "game feel juice techniques 2024"
- "HTML5 game screen effects canvas"
- "indie game feel improvements list"

Extract techniques not already in `knowledge/techniques/game-feel.md`

### Task 4 — New Mechanic Ideas
Search:
- "casual game mechanics 2024 trending"
- "hypercasual game design patterns"
- "one tap game mechanics list"

For each interesting mechanic found: add to `pipeline/queue.json` ideas[] as a new idea
with: id, title, concept, genre, artStyle (suggested), tags, estimatedBuildTime

### Task 5 — Update Knowledge Index
After all tasks, update `knowledge/KNOWLEDGE.md`:
- Increment "Knowledge entries" count
- Update "Last updated" date
- Add any new Quick Reference lessons discovered

---

## Output Format for Research Findings

```markdown
## Research Update — [YYYY-MM-DD]

**Source:** [URL or search query]
**Relevance:** HIGH/MED/LOW

### Finding: [Short title]
[2-3 sentences describing the technique]

**Implementation:**
```js
// Code snippet if applicable
```

**When to use:** [Which game types / situations]
**Applied to:** [Game name] — [result if applicable]
```

---

## Research Cadence

- **Trigger automatically:** After every 3rd game is shipped
- **Trigger manually:** When Idea Agent says "ideas pool running low"
- **Never:** During an active build cycle (don't distract Dev Agent mid-game)

---

## What to Do with Findings

1. Pixel art / animation techniques → `knowledge/techniques/pixel-art.md`
2. Game feel / juice → `knowledge/techniques/game-feel.md`
3. New game ideas → `pipeline/queue.json` ideas array
4. CrazyGames trends → `knowledge/research/crazygames-trends.md`
5. Anything that changes how we BUILD games → `agents/AGENT_INSTRUCTIONS.md`

After writing: update `knowledge/KNOWLEDGE.md` index and log to `pipeline/state.json` activity log.
