import { qs, qsa, $on } from './helpers.js'
import Whacka from './whacka.js'
const $start = qs('.start-button')

function ready() {
  const game = new Whacka(30, 3, 3)
  const $moles = qsa('.mole-hole')

  $moles.forEach((mole, i) => {
    $on(mole, 'mousedown', () => game.hideMole(i))
  })

  game.start()
}

$on($start, 'click', ready)
