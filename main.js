import { qs, $on } from './helpers.js'
import Whacka from './whacka.js'
const $start = qs('.start-button')
const game = new Whacka(30)

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

export { game }
