# QA Agent — Testing Protocol

The QA Agent runs after the Dev Agent finishes a game. It uses browser preview tools
to actually load and interact with the game, then produces a structured report.

## How to Run QA on a Game

1. Read `pipeline/queue.json` — find game with status `"build"` 
2. Start a preview server pointing at `games/{game-id}/`
3. Navigate to `game.html`
4. Execute each test in the checklist below
5. Write report to `pipeline/qa-reports/{game-id}.json`
6. Update game status in queue.json:
   - All critical tests pass → status = `"qa"` (ready to ship)
   - Any critical test fails → status = `"qa-fail"` (send back to dev)
7. Update state.json agent statuses + activity log

## Test Checklist

### CRITICAL (any failure = send back to dev)
- [ ] **LOAD** — Page loads, no blank white screen, no JS errors on load
- [ ] **TITLE_RENDERS** — Title screen is visible (not black, not blank)
- [ ] **GAME_STARTS** — Pressing Space/clicking transitions state from TITLE → PLAY
- [ ] **PLAYER_EXISTS** — `player` object is defined with valid x/y after start
- [ ] **NO_INSTANT_DEATH** — Player survives at least 2 seconds after game starts
- [ ] **WALLS_SPAWN** — At least one wall appears within 5 seconds
- [ ] **SCORE_INCREMENTS** — Score goes above 0 after walls are passed
- [ ] **DEATH_WORKS** — Dying transitions to DEAD state correctly
- [ ] **RESTART_WORKS** — After death, triggering input returns to PLAY state
- [ ] **GAME_OVER_SCREEN** — DEAD state shows game over UI (not blank)

### WARNING (logged but does not block shipping)
- [ ] **BEST_SCORE** — localStorage best score persists across restarts
- [ ] **SPEED_INCREASES** — Speed level increments as score rises
- [ ] **MOBILE_VIEWPORT** — Canvas is sized correctly at 375px width
- [ ] **NO_CONSOLE_ERRORS** — No errors in browser console during play

## How to Execute Each Test (eval scripts)

### LOAD test
```js
// Check page has a canvas or game container
({ hasCanvas: !!document.querySelector('canvas'), bodyText: document.body.innerText.slice(0,100) })
```

### TITLE_RENDERS test
```js
// State should be 0 (TITLE) and stars/particles should be initialized
({ state, hasStars: Array.isArray(stars) && stars.length > 0 })
```

### GAME_STARTS test
```js
handleInput(); // trigger start
// wait 100ms then check
({ state }) // should be 1 (PLAY)
```

### NO_INSTANT_DEATH test
```js
// After starting, check player survives 2s
// Trigger grace flip, then check state after 2500ms
```

### WALLS_SPAWN test
```js
({ wallCount: walls.length, wallTimer })
```

### SCORE_INCREMENTS test
```js
// Teleport player into a wall gap and fast-forward
({ score })
```

### DEATH_WORKS + GAME_OVER_SCREEN test
```js
// Force player to boundary
player.y = 0;
// wait for collision detection
({ state }) // should be 2 (DEAD)
```

### RESTART_WORKS test
```js
handleInput();
({ state }) // should be 1 (PLAY) again
```

## QA Report Format

Write to `pipeline/qa-reports/{game-id}.json`:
```json
{
  "gameId": "game-id",
  "testedAt": "ISO timestamp",
  "verdict": "PASS" | "FAIL",
  "retryCount": 0,
  "criticalIssues": [
    {
      "test": "TEST_NAME",
      "result": "FAIL",
      "detail": "What went wrong and what the value was",
      "fix": "Suggested fix for the Dev Agent"
    }
  ],
  "warnings": [...],
  "passedTests": ["LOAD", "TITLE_RENDERS", ...],
  "screenshots": {
    "title": "description of what title screen looked like",
    "gameplay": "description of gameplay screenshot",
    "gameover": "description of game over screenshot"
  },
  "devFeedback": "Summary paragraph telling Dev Agent exactly what to fix"
}
```

## Retry / Escalation Logic

- Max 3 QA cycles per game
- On retry: Dev Agent reads `devFeedback` from the last QA report and fixes only those issues
- After 3 failures: status = `"blocked"`, log to activity, move to next game
- On pass: status = `"qa"`, log "✅ QA PASSED: {game}", note in activity log

## Master Agent Loop

After QA writes its report:
1. Read verdict
2. If PASS → update queue status to `"qa"`, log `🚀 SHIPPED: {game}`  
3. If FAIL → update queue status to `"qa-fail"`, set `activeAgent = "developer"`,
   write `devFeedback` into game object in queue.json so Dev Agent sees it on next cycle
4. Dev Agent on next cycle: reads `devFeedback`, opens `games/{id}/game.html`, applies fixes
5. Set status back to `"build"` and trigger QA again


## Playwright INTEGRATED ✅
Run: npm run test:qa
Base template: tests/game-qa.spec.js
