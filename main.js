import { qs, qsa, $on } from './helpers.js'
import Whacka from './whacka.js'

function ready() {
  const game = new Whacka(30, 3, 3)
  const $moles = qsa('.mole-hole')

  $moles.forEach((mole, i) => $on(mole, 'mousedown', () => game.hideMole(i)))
  game.start()
}

$on(qs('.start-button'), 'click', () => {
  qs('.overlay').style.display = 'none'
  ready()
})
