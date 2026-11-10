import { qs, qsa, $on } from './helpers.js'

export default class Board {
  constructor(size = 3, onHit = () => {}) {
    this.$board = qs('.board')
    this.size = size
    this.onHit = onHit
    this.grid = []
    this.flashTimers = []
    this.makeGrid(size)
    this.updateGrid(size)
  }

  updateGrid(size) {
    this.$board.style.gridTemplateColumns = `repeat(${size}, 1fr)`
    this.$board.style.gridTemplateRows = `repeat(${size}, 1fr)`
    this.$board.innerHTML = ''
    for (let i = 1; i <= size * size; i++) {
      const moleHTML = `
      <div class="mole-container">
        <div class="mole-hole" role="group" aria-label="Hole ${i}">
          <div class="mole"></div>
        </div>
      </div>`
      this.$board.innerHTML += moleHTML
    }
    this.$cells = qsa('.mole-container', this.$board)
    const $holes = qsa('.mole-hole', this.$board)
    $holes.forEach((hole, i) => $on(hole, 'pointerdown', () => this.onHit(i)))
  }

  flashCell(i) {
    const $cell = this.$cells[i]
    if (!$cell) return

    $cell.classList.remove('mole-container--hit')
    void $cell.offsetWidth
    $cell.classList.add('mole-container--hit')

    clearTimeout(this.flashTimers[i])
    this.flashTimers[i] = setTimeout(() => {
      $cell.classList.remove('mole-container--hit')
    }, 250)
  }

  makeGrid(size) {
    size **= 2
    this.grid = new Array(size).fill(0)
  }
}
