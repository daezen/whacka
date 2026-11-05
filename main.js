import { qs, $on } from './helpers.js'
import Whacka from './whacka.js'
const $start = qs('.start-button')
const game = new Whacka(30, 3, 3)

function ready() {
  $on(document.body, 'mousedown', e => {
    if (e.target.matches('.play-again')) {
      game.reset()
    }

    if (
      e.target.matches('.mole-container') ||
      e.target.matches('.background') ||
      e.target.matches('.board')
    ) {
      game.hitBoard()
    }
  })

  game.start()
}

$on($start, 'click', ready)
$on(document, 'keydown', e => {
  if (e.key === 'Escape') {
    game.togglePause()
  }

  if (e.key === ' ') {
    if (game.running || game.paused || qs('.play-again')) {
      e.preventDefault()
      game.reset()
    }
  }
})

export { game }
