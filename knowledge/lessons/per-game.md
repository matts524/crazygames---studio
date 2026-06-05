# Per-Game Lessons

Each shipped game teaches us something. This file grows with every release.

---

## Game 1: Gravity Flipper
**Genre:** Hypercasual endless runner  
**Art Style:** Neon  
**Final Score:** 7.8/10 (after fixes)  
**CrazyGames Category:** Arcade

### What Worked
- Single mechanic (gravity flip) was instantly understandable
- Neon glow effects with `shadowBlur` looked great at no performance cost
- Web Audio sine beep for flip felt satisfying
- localStorage high score was simple but effective

### What Failed First
- **CRITICAL:** `stars` array not initialised before game loop — black title screen
- **CRITICAL:** No grace period — player died in <1 second before first wall appeared
- These would have been instant CrazyGames rejections

### Fixed By
- Initialising `stars` and `particles` at module load time (outside `init()`)
- Adding `graceTimer = 90` frames where player bobs gently before gravity applies

### Lessons Written to Knowledge Base
- Always initialise visual arrays at load time, not in `init()`
- All games need a grace/tutorial moment at the start
- One-mechanic games are fastest to build AND test AND get approved

---

## Game 2: Pixel Chef Rush
**Genre:** Casual cooking / time-management  
**Art Style:** Pixel Art  
**Reflexion Round 1 Score:** 5.5 → 7.8/10  
**CrazyGames Category:** Casual

### What Worked
- Order matching mechanic was immediately intuitive (click ingredients → serve)
- Pixel art cooking aesthetic scored well in our colour palette tests
- 10 recipe variety kept game fresh across 5 difficulty levels
- CrazyGames SDK integrated correctly from the start (learned from Gravity Flipper)

### Reflexion Round 1 Improvements
1. **Screen shake on wrong serve** — massively improved "feel" score
2. **Urgent order pulse** — fixed the biggest clarity issue (players missed expiring orders)
3. **Plate match glow** — "✓ READY TO SERVE!" indicator removed biggest confusion point
4. **Streak system** — free engagement boost, players try to maintain streaks

### Lessons Written to Knowledge Base
- Cooking/time-management games NEED a clear "ready" indicator — players can't hold all recipe info in memory
- Timer bars alone aren't enough urgency — need colour + pulse + sound
- Streak systems add engagement for almost zero code cost — always include one
- Pixel art drawn with fillRect looks surprisingly good if palette is consistent

### Round 2 Plans (pending)
- Score pop animations (numbers fly up when coins earned)
- Kitchen character (chef face reacts to events)
- "Rush Hour" event at level 4+ (temporary 2× order spawn rate)

---

## Patterns Across All Games

| Pattern | First seen | Now applied to |
|---------|-----------|---------------|
| GraceTimer at start | Gravity Flipper fix | All games via template |
| Streak system | Pixel Chef Rush | Planned for all future games |
| Urgent timer pulse | Pixel Chef Rush | Planned for all timed games |
| pauseLoop/resumeLoop | Gravity Flipper | All games (required for QA) |
| Stars init at load | Gravity Flipper | All games (required to avoid black screen) |
