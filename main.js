import { qs, qsa, $on } from './helpers.js'
import Whacka from './whacka.js'

function ready() {
  const game = new Whacka(30, 3, 3)
  const $board = qs('.board')
  const $moles = qsa('.mole-hole')
  $on($board, 'mousedown', () => game.missedHit())
  $moles.forEach((mole, index) => $on(mole, 'mousedown', () => game.hitMole(index)))
  game.start()
}

$on(qs('.start-button'), 'click', () => {
  qs('.overlay').style.display = 'none'
  ready()
})
