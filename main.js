import { qs, qsa, $on } from './helpers.js'
import Whacka from './whacka.js'
const $start = qs('.start-button')

function ready() {
  const game = new Whacka(30)
  const $moles = qsa('.mole-hole')

  $on(document.body, 'click', e => {
    if (
      e.target.matches('.mole-container') ||
      e.target.matches('.background') ||
      e.target.matches('.board')
    ) {
      game.hitBoard()
    }
  })

  $moles.forEach((mole, i) => $on(mole, 'mousedown', () => game.hitMole(i)))
  game.start()
}

$on($start, 'click', ready)
