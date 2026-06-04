# Autonomous Cycle Runner

When invoked, Claude should:

1. Read `pipeline/queue.json` and `pipeline/state.json`
2. Find the highest-priority game that needs the next stage
3. Execute that stage fully
4. Update state files
5. Repeat until all in-progress games advance one stage

This file is the trigger document. Claude reads it via /loop or schedule.
