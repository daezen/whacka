import { qs, $on } from './helpers.js'
import Whacka, { HIT_POINTS } from './whacka.js'

const $mute = qs('.mute-button')
const game = new Whacka(30, 3, 3)
const $pointsPreview = document.createElement('span')
$pointsPreview.className = 'hit-points hit-points--preview'
$pointsPreview.textContent = `+${HIT_POINTS}`
$pointsPreview.hidden = true
$pointsPreview.setAttribute('aria-hidden', 'true')
document.body.append($pointsPreview)

function newGame() {
  try {
    game.sound.unlock()
  } catch {
    // Sound is optional; never block starting a round.
  }
  game.reset()
}

function updateMute() {
  const muted = game.sound.muted
  $mute.textContent = muted ? '🔇' : '🔊'
  $mute.setAttribute('aria-label', muted ? 'Unmute sound' : 'Mute sound')
  $mute.setAttribute('aria-pressed', String(muted))
}

function handleKeydown(e) {
  if (e.target.closest?.('select')) return
  if (e.key === 'Escape') {
    game.togglePause()
    return
  }

  if (e.key === ' ') {
    // Let focused buttons activate normally instead of restarting the game.
    if (e.target.closest?.('button')) return
    if (game.running || game.paused || qs('.play-again')) {
      e.preventDefault()
      newGame()
    }
    return
  }

  if (e.ctrlKey || e.metaKey || e.altKey) return
  if (!e.repeat && e.code === 'KeyP') {
    $pointsPreview.hidden = !$pointsPreview.hidden
    return
  }
  if (!e.repeat && e.code === 'KeyM') {
    game.debugSpawnAll()
  }
}

$on(document, 'click', e => {
  const $button = e.target.closest('button')
  if (!$button) return

  if (
    $button.matches(
      '.start-button, .play-again, .restart-button, .game-restart',
    )
  ) {
    newGame()
  } else if ($button.matches('.resume-button, .game-pause')) {
    game.togglePause()
  } else if ($button.matches('.mute-button')) {
    game.sound.toggle()
    updateMute()
    if (!game.sound.muted) game.sound.tick()
  }
})

$on(document.body, 'pointerdown', e => {
  if (
    e.target.matches('.mole-container') ||
    e.target.matches('.background') ||
    e.target.matches('.board')
  ) {
    game.hitBoard()
  }
})

$on(document, 'keydown', handleKeydown)

$on(document, 'change', e => {
  if (e.target.matches('[data-duration]')) game.setDuration(Number(e.target.value))
})

$on(document, 'visibilitychange', () => {
  if (document.hidden && game.running && !game.paused && !game.countingDown) {
    game.pause(true)
  }
})

updateMute()

export { game }
