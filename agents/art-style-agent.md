# Art Style Agent

The Art Style Agent is consulted by the Design Agent before building begins.
It picks the right visual style for each game and provides the Dev Agent with
a concrete CSS/canvas palette and drawing approach.

---

## Available Styles

### 🎮 PIXEL
Classic pixel art — crisp edges, limited palette, chunky sprites.
Best for: platformers, RPGs, cooking games, dungeon crawlers

**Canvas approach:**
- `ctx.imageSmoothingEnabled = false` always
- Draw on a low-res canvas (e.g. 160×144) then scale up 3×
- Color palette: 4–16 colors max
- Example palettes:
  - GB Palette: `#0f380f #306230 #8bac0f #9bbc0f`
  - NES warm:   `#fcfcfc #f8d878 #e45c10 #881400`
  - Pastel:     `#ffd6e0 #ffb3c1 #ff85a1 #f9226b`

**Sprite drawing (canvas, no images):**
```js
// Draw a pixel-art character using a pixel map array
function drawSprite(ctx, px, py, scale, map, palette) {
  map.forEach((row, y) => row.forEach((c, x) => {
    if (c === 0) return;
    ctx.fillStyle = palette[c - 1];
    ctx.fillRect(px + x * scale, py + y * scale, scale, scale);
  }));
}
// Example 8×8 character map (0=transparent, 1=skin, 2=shirt, 3=dark)
const charMap = [
  [0,0,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,0],
  [0,0,2,2,2,2,0,0],
  [0,2,2,2,2,2,2,0],
  [0,0,3,0,0,3,0,0],
  [0,0,3,3,3,3,0,0],
];
```

---

### 🌟 NEON
Dark background, glowing bright outlines, cyberpunk feel.
Best for: arcade, runners, action, rhythm

**CSS variables:**
```css
--bg: #0a0a0f; --glow1: #06b6d4; --glow2: #a855f7; --glow3: #f59e0b;
```

**Canvas glow effect:**
```js
ctx.shadowColor = '#06b6d4';
ctx.shadowBlur  = 16;
ctx.strokeStyle = '#06b6d4';
ctx.lineWidth   = 2;
// Draw shape, then reset shadow
ctx.shadowBlur  = 0;
```

**Neon gradient:**
```js
const g = ctx.createLinearGradient(x, y, x + w, y);
g.addColorStop(0, '#06b6d4'); g.addColorStop(1, '#a855f7');
ctx.fillStyle = g;
```

---

### 🔷 VECTOR / FLAT
Clean geometric shapes, flat colors, no outlines, Material-inspired.
Best for: idle games, clickers, puzzle, casual

**Palette:**
```js
const COLORS = {
  bg: '#f8fafc', primary: '#6366f1', accent: '#f59e0b',
  success: '#10b981', danger: '#ef4444', text: '#1e293b', muted: '#94a3b8'
};
```

**Style rules:**
- No outlines/strokes — shape edges define objects
- Use `border-radius` heavily (CSS) or arc paths (canvas)
- Subtle drop shadows: `ctx.shadowColor = 'rgba(0,0,0,0.1)'; ctx.shadowBlur = 8;`
- Animations: smooth easing (ease-in-out), no sharp transitions

---

### 👾 RETRO ARCADE
CRT scanlines, high contrast, arcade cabinet feel.
Best for: word games, classic remakes, score-chasers

**CRT scanline overlay (draw last every frame):**
```js
for (let y = 0; y < H; y += 3) {
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(0, y, W, 1);
}
```

**Palette:** Black bg `#000`, green phosphor `#00ff41`, amber `#ffb000`, white `#ffffff`

**Font:** Use monospace — `'Courier New', monospace` at integer sizes

---

### ✨ MINIMALIST
Almost no color, lots of whitespace, typography-forward.
Best for: word games, logic puzzles, number games

**Palette:** `#ffffff` bg, `#111827` text, one accent color (e.g. `#6366f1`)

**Rules:**
- Maximum 3 colors total
- No textures, no gradients, no shadows
- Shapes: circles and rectangles only
- Animation: scale + opacity only

---

### 🌸 CUTE / KAWAII
Pastel colors, rounded shapes, friendly characters.
Best for: puzzle, cooking, pet games

**Palette:**
```js
'#fff0f6', '#ffd6e7', '#ffb3c1', '#ff85a1',  // pinks
'#c0f0ff', '#a0d8ef',                          // blues
'#fff3b0', '#ffe066'                            // yellows
```

**Style rules:**
- Round everything: `border-radius: 50%` / arc paths
- Eyes = two circles + two smaller white circles (highlight)
- Rosy cheeks = semi-transparent pink circles, r=4, opacity 0.4
- Bouncy animations: `Math.sin(Date.now()/400) * 3` pixel bob

---

## How the Art Style Agent Is Used

1. **Idea Agent** assigns a suggested `artStyle` when creating ideas
2. **Research Agent** may update it based on genre trends
3. **Design Agent** confirms final style and includes specific palette + techniques in design.md
4. **Dev Agent** imports the style section from this file and applies it faithfully
5. **QA Agent** checks visual consistency — flags if game looks unfinished or style is mixed

## Style + Genre Recommendations

| Genre        | Recommended Style  | Why                                      |
|-------------|-------------------|------------------------------------------|
| Hypercasual  | Minimalist / Neon  | Instant visual read, loads fast          |
| Arcade       | Neon / Retro       | Energetic, familiar                      |
| Puzzle       | Vector / Minimalist| Clean, focus on mechanics                |
| Platformer   | Pixel              | Classic fit, sprite system pays off      |
| Cooking      | Cute / Pixel       | Fun, colorful, inviting                  |
| Word         | Retro / Minimalist | Focus on text, no visual noise           |
| Idle/Clicker | Vector / Flat      | Numbers and icons need to be clear       |
| RPG          | Pixel / Retro      | Genre expectation                        |
