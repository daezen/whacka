import { qs, qsa, $on } from './helpers.js'
import Whacka from './whacka.js'
const $start = qs('.start-button')

function ready() {
  const game = new Whacka(30, 3, 3)
  const $moles = qsa('.mole-hole')

  $on(document.body, 'click', e => {
    console.log(e.target.classList.contains('mole'))
  })
  $moles.forEach((mole, i) =>
    $on(mole, 'mousedown', () => game.hitMole(i)),
  )

  game.start()
}

$on($start, 'click', ready)
