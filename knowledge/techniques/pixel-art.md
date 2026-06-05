# Pixel Art Techniques

## Core Rules
- Always set `ctx.imageSmoothingEnabled = false`
- Draw on a LOW-RES canvas (e.g. 200×150) then scale up 3–4× with CSS — crisp pixels
- Limit palette to 8–16 colours per scene
- Use `fillRect` for everything — no images needed

## Sprite Data Format (Studio Standard)
Sprites are stored as string arrays. Each string is a row of hex colour indices.
`'0'` = transparent. Map indices to real colours in a `PAL_SPRITE` object.

```js
const PAL_SPRITE = {
  '1': '#f5c5a3',  // skin tone
  '2': '#333333',  // dark outline
  '3': '#4a90d9',  // shirt
};

const IDLE_FRAME = [
  '0002200',   // row 0: hair
  '0212120',   // row 1: face with eyes
  '0211120',   // row 2: face
  '0033300',   // row 3: shirt
];

function drawSprite(frame, x, y, pixelSize=2, flipX=false) {
  frame.forEach((row, ry) => {
    for (let rx = 0; rx < row.length; rx++) {
      const c = row[rx];
      if (c === '0') continue;
      ctx.fillStyle = PAL_SPRITE[c] || '#ff00ff';
      const dx = flipX ? x + (row.length - 1 - rx) * pixelSize : x + rx * pixelSize;
      ctx.fillRect(dx, y + ry * pixelSize, pixelSize, pixelSize);
    }
  });
}
```

## Walk Cycle Animation (4 frames)
A convincing walk cycle needs 4 frames minimum:
- Frame 0: Right foot forward, left foot back, body slightly up
- Frame 1: Both feet together (neutral), body level
- Frame 2: Left foot forward, right foot back, body slightly up  
- Frame 3: Both feet together (neutral) — mirror of frame 1

Key principles:
- Body bobs UP on contact frames (frames 1 & 3), DOWN on passing frame
- Arms swing OPPOSITE to legs (right arm forward when right leg back)
- Head stays roughly level — don't bob the head as much as the body

## Flip for Direction
Never store separate left/right sprites. Use `flipX=true`:
```js
if (player.vx < 0) player.anim.flipX = true;
if (player.vx > 0) player.anim.flipX = false;
```

## Animation State Machine
```js
function makeAnim(sprite, state='idle') {
  return { sprite, state, frame:0, timer:0, flipX:false };
}
function updateAnim(anim, dt) {
  const spr = SPRITES[anim.sprite];
  const frames = spr.frames[anim.state];
  anim.timer += dt;
  if (anim.timer >= 1000 / spr.fps) {
    anim.timer = 0;
    anim.frame = (anim.frame + 1) % frames.length;
  }
}
function setAnimState(anim, newState) {
  if (anim.state === newState) return;
  anim.state = newState; anim.frame = 0; anim.timer = 0;
}
```

## Outlines & Depth
- 1-pixel dark outline around sprites = huge readability boost
- Draw outline by rendering sprite 1px in each direction in dark colour, then render normally on top
- Or: define outline in the sprite data itself as colour index '2' (dark)

## Backgrounds
- Tile floor: two alternating dark colours, 32×32 or 16×16
- Parallax: 2–3 layers scrolling at different speeds (0.1×, 0.3×, 1× scroll speed)
- Far bg scrolls at 10–20% of game speed — creates depth cheaply

## Common Pixel Character Sizes
- Tiny (status icons): 8×8 — 4 colours max
- Small (enemies, items): 16×16 — 8 colours
- Player character: 16×24 or 12×18 — 8–12 colours
- Large (boss): 32×32+ — up to 16 colours

---

## Research Update — 2026-06-05
**Sources:** sprite-ai.art, slynyrd.com (2025 article)

### Idle Animation — 2-Frame Breathing (NEW)
The simplest effective idle: Frame 1 = base sprite. Frame 2 = shift body down 1px.
Hold each frame 400–500ms. Loops as "breathing". One pixel of movement reads as alive at game speed.

```js
// 2-frame idle — frame 1 is base, frame 2 shifts everything down 1px
const idleFrames = [baseFrame, shiftedDownFrame];
// fps = 2 (500ms per frame)
```

### Walk Cycle — Correct 4-Frame Structure (UPDATED)
Avoid "pogo stick" effect (straight up-down bounce). Correct pattern:
- Frame 0: Right foot forward, left foot back. Body drops 1px. Opposite arm swings.
- Frame 1: Legs come together (passing). Body rises 1px. Arms at sides.
- Frame 2: Mirror of frame 0 (left foot forward). Body drops 1px.
- Frame 3: Same as frame 1 (passing). Body rises 1px.

**Timing:** 100–150ms per frame (6–10 FPS). At 16×16: 1px vertical bob is enough.

### Top-Down Walk — 6-Frame Cycle (NEW)
For top-down games, 6 frames balances economy vs smoothness:
- Pattern: down 1px, down 1px, up 2px — then repeat for opposite stride
- Hold frames at motion extremities LONGER than in-between frames
- Head bob is the most important single element — drives perception of natural movement

### Attack / Action Animation — 3-Act Rule (NEW)
Always 3 acts even for 3-frame animations:
1. **Wind-up** (1–2 frames, 80ms each): pull back to telegraph action
2. **Strike** (1–2 frames, HOLD 150–200ms): the impact
3. **Recovery** (1–2 frames, 80ms each): return to ready

The HOLD on the strike frame is what makes attacks feel impactful.

### Smear Frame Technique (NEW)
For fast attacks/movement: instead of drawing exact position, draw a 2-pixel blurred arc/streak in the motion direction. Reads as speed at game velocity without needing more frames.

### Vary Frame Duration (KEY INSIGHT)
Never play all frames at the same speed. Hold important poses longer:
```js
// Instead of: fps: 8 (uniform)
// Do this:
const frameDurations = [80, 150, 80, 150]; // ms per frame — hold passing pose longer
```

## Research Finding (2025): Trending Pixel Style
- "1-bit" (pure black and white) is trending for puzzle games
- "16-bit SNES palette" (bright, saturated) works well for action games  
- "Gameboy palette" (#0f380f, #306230, #8bac0f, #9bbc0f) = instantly recognisable nostalgia
- Dithering patterns (checkerboard for gradients) adds perceived detail without colour count
