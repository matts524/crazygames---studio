# Knowledge Agent — Self-Improvement Writer

Runs after every reflexion round completes. Extracts lessons, updates the knowledge base,
and ensures the next game build starts smarter than the last.

---

## When to Run

After EVERY reflexion round, the Knowledge Agent:
1. Reads the new reflexion report from `pipeline/reflexion/{id}-round-{n}.json`
2. Extracts concrete, reusable lessons
3. Writes them to the correct knowledge files
4. Updates `knowledge/KNOWLEDGE.md` quick reference if it's a high-impact lesson

---

## Lesson Extraction Rules

A lesson is worth writing if it's:
- **Reusable** — applies to future games, not just this one
- **Specific** — includes the actual code pattern or value (e.g. "shake=5, frames=10" not just "add screen shake")
- **Impact-proven** — came from a reflexion improvement that raised the score

Do NOT write:
- Game-specific tweaks that won't generalise
- Things already in the knowledge base
- Vague observations ("the game felt better")

---

## Where Lessons Go

| Lesson type | File |
|------------|------|
| Canvas drawing technique | `knowledge/techniques/pixel-art.md` |
| Feedback / juice / feel | `knowledge/techniques/game-feel.md` |
| Audio patterns | `knowledge/techniques/audio.md` |
| Game structure / architecture | `knowledge/techniques/architecture.md` |
| What worked for a specific game | `knowledge/lessons/per-game.md` |
| CrazyGames platform insight | `knowledge/research/crazygames-trends.md` |

---

## How the Dev Agent Uses Knowledge

Before building any game, the Dev Agent MUST:
1. Read `knowledge/KNOWLEDGE.md` (Quick Reference section)
2. Read `knowledge/techniques/game-feel.md` (apply streak, shake, timer pulse)
3. Read `knowledge/techniques/pixel-art.md` if artStyle is pixel/retro
4. Read `knowledge/lessons/per-game.md` to avoid repeating past mistakes

This means: by game 5, the Dev Agent's first draft will already have all the things that
took reflexion rounds to add to games 1 and 2. Quality compounds over time.

---

## Skill Level Tracker

Track the studio's accumulated skill in `knowledge/KNOWLEDGE.md`:

```
Games built: N
Average reflexion score improvement per round: X
Most common reflexion issue: Y
Techniques mastered: Z
```

When the same issue appears in 2+ reflexion reports (e.g. "no streak system"),
add it to the **MANDATORY checklist** in `agents/AGENT_INSTRUCTIONS.md` so it's
built in from day one for all future games — never needs reflexion to add it again.

---

## Evolving the Templates

When a technique proves valuable across 2+ games, add it to the relevant template:
- Game feel lessons → add to ALL templates
- Pixel art patterns → add to `templates/pixel-platformer.html`
- Runner patterns → add to `templates/endless-runner.html`

This way templates get smarter over time too. Template v3 will be substantially
better than template v1 because it contains everything reflexion has ever taught us.
