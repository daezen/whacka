# whacka

A small whack-a-mole browser game built with plain HTML, CSS, and ES modules.
No build step, no dependencies.

## Run

ES modules must be served over HTTP, so open it from a local server rather than
`file://`:

```sh
python3 -m http.server 8000
```

Then visit <http://localhost:8000/>.

## How to play

- **Click / tap** a mole to whack it.
- **Esc** pauses and resumes.
- **Space** restarts.
- On phones, use the **pause** and **restart** buttons at the top left.
- The speaker button in the top right toggles sound.
- **P** toggles a pinned points popup for styling.
- **M** spawns a mole in every hole during an active round.

Choose **15, 30, or 60 seconds** from Round length on the start or results menu.
A successful hit is **+10**, a miss is **−5**, and a mole
that escapes costs **−6**. Every five consecutive hits earn **+2** extra.
A miss or escape resets the streak.
The game remembers your round length, best score for each duration, and mute setting.

## Files

- `main.js` — wires up input, menus, the mute button, and auto-pause.
- `whacka.js` — game state: timer, score, moles, countdown, best score.
- `board.js` — builds the grid and handles per-hole pointer input and hit flash.
- `loop.js` — `requestAnimationFrame` loop.
- `view.js` — timer/score text and the start, countdown, pause, and score overlays.
- `audio.js` — tiny Web Audio sound effects.
- `helpers.js` — `qs` / `qsa` / `$on` utilities.
- `style.css` — responsive full-viewport layout and animations.
