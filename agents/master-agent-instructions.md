# Master Agent — Orchestration Instructions

The Master Agent runs at the start of every autonomous cycle. It reads pipeline state,
decides what needs to happen next, assigns work to the right agent, and ensures nothing
gets stuck. Think of it as the studio director.

## Cycle Entry Point

When Claude is invoked for an autonomous cycle, it ALWAYS starts here:

```
1. Read pipeline/state.json
2. CHECK studioRunning flag — if false, STOP immediately:
   - Log "⏸ Studio paused — cycle skipped"
   - Do NOT read queue, do NOT execute any agent work
   - Exit cycle
3. Read pipeline/queue.json
4. Run TRIAGE (below)
5. Execute the highest-priority action
6. Update state files
7. Report what happened
```

## Pause / Resume

- `studioRunning: true`  → proceed normally
- `studioRunning: false` → halt at step 2, do nothing, log the skip
- Any in-progress cycle that started before a pause will finish its current stage gracefully — it will NOT abandon a half-built game mid-way. It just won't start the NEXT stage.
- When the user sets `studioRunning` back to `true`, the next cycle resumes from wherever the pipeline left off.

## Triage Priority Order

Check each condition in order — act on the FIRST one that matches:

### Priority 1 — Fix blocked QA failures
- If any game has status `"qa-fail"` AND `retryCount < 3`:
  → Dev Agent: read QA report, fix issues, set status back to `"build"`
  
- If any game has status `"qa-fail"` AND `retryCount >= 3`:
  → Set status to `"blocked"`, log it, move on

### Priority 2 — Run QA on completed builds
- If any game has status `"build"`:
  → QA Agent: run full test suite, write report, update status

### Priority 3 — Build designed games
- If any game has status `"design"`:
  → Dev Agent: build the game.html, set status to `"build"`

### Priority 4 — Design researched games
- If any game has status `"research"`:
  → Design Agent: write design.md, set status to `"design"`

### Priority 5 — Research new ideas
- If any game has status `"idea"` in ideas[]:
  → Research Agent: write research.md, move game to inProgress[], set status to `"research"`

### Priority 6 — Generate new ideas
- If ideas[] is empty AND inProgress[] length < 3:
  → Idea Agent: generate 3 new game ideas, add to ideas[]

### Priority 7 — Nothing to do
  → Log "Studio idle — all games up to date", update agent statuses to idle

## Agent Status Updates

Before executing any action, update state.json:
- Set the relevant agent's status to `"active"` or `"thinking"`
- Set their `currentTask` to describe exactly what they're doing
- All other agents: status = `"idle"`

After completing:
- Set agent status back to `"idle"`
- Append to activityLog (max 50 entries, trim oldest if over)
- Update lastUpdated timestamp

## QA Failure Routing

When QA fails, the Master Agent writes a `devFeedback` field directly into the
game object inside queue.json so the Dev Agent has clear instructions:

```json
{
  "id": "game-id",
  "status": "qa-fail",
  "retryCount": 1,
  "devFeedback": "QA FAIL — Fix these issues:\n1. TITLE_RENDERS: stars array not initialized before first frame\n2. NO_INSTANT_DEATH: player has no grace period, dies in <1s\n\nSuggested fixes: ...",
  ...
}
```

## New Idea Generation Rules

When generating new game ideas, follow these rules:
- Check queue.json shipped[] to avoid duplicates
- Prioritize genres underrepresented in the pipeline
- Each idea must have: id (kebab-case), title, concept (1 sentence), genre, tags[]
- Good CrazyGames genres: hypercasual, puzzle, arcade, word, idle, clicker, platformer
- Avoid: shooters, complex RPGs, anything needing external assets
- Aim for: playable in <5 min, understandable in <10 seconds

## Cycle Log Message Format

Always end each cycle with a clear summary:
```
CYCLE COMPLETE
- Action taken: [what happened]
- Game affected: [game title]  
- New status: [status]
- Next cycle will: [what will happen next]
```
