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
- **1–9** hit a hole by position (left-to-right, top-to-bottom).
- **Esc** pauses and resumes.
- **Space** restarts.
- On phones, use the **pause** and **restart** buttons at the top left.
- The speaker button in the top right toggles sound.

You have 30 seconds. A successful hit is **+10**, a miss is **−5**, and a mole
that escapes costs **−6**. Your best score is saved in `localStorage`, and a
muted setting is remembered too.

## Files

- `main.js` — wires up input, menus, the mute button, and auto-pause.
- `whacka.js` — game state: timer, score, moles, countdown, best score.
- `board.js` — builds the grid and handles per-hole pointer input and hit flash.
- `loop.js` — `requestAnimationFrame` loop.
- `view.js` — timer/score text and the start, countdown, pause, and score overlays.
- `audio.js` — tiny Web Audio sound effects.
- `helpers.js` — `qs` / `qsa` / `$on` utilities.
- `style.css` — responsive full-viewport layout and animations.
