# CrazyGames Submission Guide
**GitHub:** matts524 | **CrazyGames Portal:** developer.crazygames.com (logged in as matts)

---

## Your Game URLs (GitHub Pages)

Once the repo is pushed, your games will be live at:

| Game | GitHub Pages URL |
|------|-----------------|
| Gravity Flipper | https://matts524.github.io/crazygames-studio/games/gravity-flip/game.html |
| Snake Chaos | https://matts524.github.io/crazygames-studio/games/snake-chaos/game.html |
| Tower Collapse | https://matts524.github.io/crazygames-studio/games/tower-collapse/game.html |
| Pixel Chef Rush | https://matts524.github.io/crazygames-studio/games/pixel-chef/game.html |
| *(new games auto-added here)* | https://matts524.github.io/crazygames-studio/games/{id}/game.html |

---

## One-Time Setup (do this once)

### Step 1 — Create the GitHub repo

1. Go to https://github.com/new
2. Repository name: `crazygames-studio`
3. Set to **Public** (required for GitHub Pages)
4. Do NOT add README or .gitignore — leave it empty
5. Click **Create repository**

### Step 2 — Push the game-studio folder

Open PowerShell or Command Prompt:

```powershell
cd "C:\Users\matts\OneDrive\apps to maek\game-studio"
git init
git add .
git commit -m "Initial commit - game studio + Gravity Flipper"
git branch -M main
git remote add origin https://github.com/matts524/crazygames-studio.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages

1. Go to https://github.com/matts524/crazygames-studio/settings/pages
2. Source: **Deploy from a branch**
3. Branch: **main** | Folder: **/ (root)**
4. Click **Save**
5. Wait ~2 minutes — your site goes live at https://matts524.github.io/crazygames-studio/

### Step 4 — Test the live URL

Open in Chrome: https://matts524.github.io/crazygames-studio/games/gravity-flip/game.html
- Confirm it loads (not 404)
- Test on mobile too

---

## Submitting Each Game to CrazyGames

1. Go to https://developer.crazygames.com → **My Games** → **+ Add Game**
2. Fill in:
   - **Game URL**: `https://matts524.github.io/crazygames-studio/games/gravity-flip/game.html`
   - **Title**: Gravity Flipper
   - **Description**: *"Tap to flip gravity and dodge the walls in this fast-paced one-button arcade game. How far can you go?"*
   - **Category**: Arcade
   - **Tags**: hypercasual, one-button, arcade, runner, endless
   - **Orientation**: Portrait
3. Upload thumbnail (512×512) and banner (1920×1080)
4. Submit — review typically takes 1–3 weeks

---

## Pushing Updates After Changes

Each time a game is built or improved:

```powershell
cd "C:\Users\matts\OneDrive\apps to maek\game-studio"
git add games/gravity-flip/
git commit -m "Update Gravity Flipper - fix X"
git push
```

GitHub Pages auto-deploys within ~60 seconds. CrazyGames picks up changes within 24hrs.

---

## Note on imposter-grid repo

You already have `matts524/imposter-grid` — that repo hosts one game.
The new `crazygames-studio` repo will host ALL games in one place under `/games/`.
You can keep both — they're separate.

---

## CrazyGames Pre-Submit Checklist

Use `OPEN IFRAME TESTER.bat` to run through this before every submission:

- [ ] Game loads at GitHub Pages URL with no errors
- [ ] Works in iframe (iframe tester: 3 auto-checks pass)  
- [ ] Title screen visible on load (not black)
- [ ] Touch controls work at 375px mobile width
- [ ] Game over screen appears and restart works
- [ ] No audio plays before first user interaction
- [ ] No external dependencies that could break
- [ ] Thumbnail image ready (512×512px)
