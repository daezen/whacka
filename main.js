import { qs, qsa } from '/helpers.js'
import Board from '/board.js'

class Whacka {
  constructor() {
    this.board = new Board()
    this.$moles = qsa('.mole')
  }
  start() {
    setInterval(() => this.randomMole(), 500)
  }
  randomMole() {
    const index = Math.floor(Math.random() * this.$moles.length)
    const $mole = this.$moles[index]
    if ($mole.classList.contains('mole--show')) {
      $mole.classList.remove('mole--show')
    } else $mole.classList.add('mole--show')
  }
}

const game = new Whacka()
game.start()
