# Game Feel ("Juice") Techniques

## The Golden Rule
Every meaningful action needs THREE responses: visual + audio + physical

Wrong: enemy dies → it disappears  
Right: enemy dies → particles burst + death sound + screen flash + score pops up

---

## Screen Shake (Studio Standard)
```js
// Variables (add to game state)
let shake = 0, shakeFrames = 0;

// Trigger a shake
function doShake(intensity=5, frames=10) {
  shake = intensity; shakeFrames = frames;
}

// In draw function, wrap everything in:
ctx.save();
if (shakeFrames > 0) {
  ctx.translate((Math.random()-0.5)*shake*2, (Math.random()-0.5)*shake*2);
  shakeFrames--;
  if (shakeFrames === 0) shake = 0;
}
// ... draw everything ...
ctx.restore();
```

**Calibrated values (learned from reflexion):**
- Minor mistake: shake=4, frames=8
- Major hit / death: shake=7, frames=14  
- Level complete: shake=3, frames=6 (positive, gentler)

---

## Particles (Studio Standard)
```js
let particles = [];

function spawnParticles(x, y, color, count=8, speed=3) {
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed * (0.5 + Math.random()),
      vy: Math.sin(angle) * speed * (0.5 + Math.random()),
      life: 1,
      decay: 0.03 + Math.random() * 0.03,
      r: 2 + Math.random() * 3,
      color,
    });
  }
}

function updateParticles(dt) {
  const t = dt / 16.67;
  particles = particles.filter(p => {
    p.x += p.vx * t; p.y += p.vy * t;
    p.vy += 0.15 * t; // gravity
    p.life -= p.decay * t;
    return p.life > 0;
  });
}

function drawParticles() {
  particles.forEach(p => {
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}
```

---

## Squash & Stretch
Makes objects feel physical and alive. Apply on jump/land/bounce:
```js
// On jump: stretch vertically, squash horizontally
ctx.scale(0.7, 1.3);  // squash/stretch

// On land: squash vertically, stretch horizontally  
ctx.scale(1.3, 0.7);

// Lerp back to normal over ~5 frames
```

---

## Hit-Stop (Freeze Frame)
Pause everything for 2–4 frames on big impacts. Massively improves impact feel:
```js
let hitStopFrames = 0;

// In update loop:
if (hitStopFrames > 0) { hitStopFrames--; return; }

// Trigger with:
function doHitStop(frames=3) { hitStopFrames = frames; }
```

---

## Score Pop Animation
Numbers that fly up and fade when earned:
```js
let scorePopups = [];

function addScorePop(x, y, value, color='#ffd700') {
  scorePopups.push({ x, y, value, vy: -1, life: 1 });
}

// In draw:
scorePopups = scorePopups.filter(p => {
  p.y += p.vy; p.life -= 0.025;
  ctx.globalAlpha = p.life;
  ctx.fillStyle = color;
  ctx.font = 'bold 12px Courier New';
  ctx.textAlign = 'center';
  ctx.fillText(`+${p.value}`, p.x, p.y);
  return p.life > 0;
});
ctx.globalAlpha = 1;
```

---

## Urgent Timer Pulse
For any timer-based mechanic, pulse red when <25% remaining:
```js
function drawTimerBar(x, y, w, h, ratio) {
  const urgent = ratio < 0.25;
  const pulse = urgent ? Math.sin(Date.now() / 150) * 0.5 + 0.5 : 1;
  const color = ratio > 0.5 ? '#10b981' : ratio > 0.25 ? '#f59e0b' : `rgba(239,68,68,${0.5+pulse*0.5})`;
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w * ratio, h);
  if (urgent) {
    ctx.strokeStyle = `rgba(239,68,68,${pulse*0.6})`;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);
  }
}
```

---

## Combo/Streak System
Always include some form of consecutive-success reward:
```js
let streak = 0;

// On success:
streak++;
const bonus = streak >= 3 ? Math.floor(streak / 3) * 5 : 0;
score += base + bonus;
if (streak >= 3) spawnParticles(x, y, '#f59e0b', 10); // gold burst

// On failure:
streak = 0;
```

---

## Lessons from Reflexion Rounds

| Improvement | Score impact | Notes |
|-------------|-------------|-------|
| Screen shake on wrong action | +0.3 feel | frames=10, intensity=5 |
| Urgent timer pulse | +0.4 clarity | sin wave, threshold <25% |
| Match indicator (glow on target) | +0.5 clarity | biggest single win |
| Streak system | +0.3 engagement | even simple streak = more fun |
| Score pop animation | +0.2 visual | planned for round 2 |
