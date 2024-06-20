import { qs, qsa, $on } from '/helpers.js'
import { game } from './main.js'

export default class Board {
  constructor(size = 3) {
    this.$board = qs('.board')
    this.size = size
    this.grid = []
    this.makeGrid(size)
    this.updateGrid(size)
  }

  updateGrid(size) {
    this.$board.style.gridTemplateColumns = `repeat(${size}, 1fr)`
    this.$board.style.gridTemplateRows = `repeat(${size}, 1fr)`
    this.$board.innerHTML = null
    for (let i = 1; i <= size * size; i++) {
      const moleHTML = `
      <div class="mole-container">
        <div class="mole-hole">
          <div class="mole"></div>
        </div>
      </div>`
      this.$board.innerHTML += moleHTML
    }
    const $moles = qsa('.mole-hole')
    $moles.forEach((mole, i) => $on(mole, 'mousedown', () => game.hitMole(i)))
  }

  makeGrid(size) {
    size **= 2
    this.grid = new Array(size).fill(0)
  }
}
