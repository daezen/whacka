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
    const holes = []
    for (let i = 1; i <= size * size; i++) {
      holes.push(`
      <div class="mole-container">
        <div class="mole-hole" role="group" aria-label="Hole ${i}">
          <div class="mole"></div>
        </div>
      </div>`)
    }
    this.$board.innerHTML = holes.join('')
    this.$cells = qsa('.mole-container', this.$board)
    const $holes = qsa('.mole-hole', this.$board)
    $holes.forEach((hole, i) => $on(hole, 'pointerdown', () => this.onHit(i)))
  }

  flashMole(i, points) {
    const $cell = this.$cells[i]
    const $mole = $cell?.querySelector('.mole')
    if (!$mole) return

    $mole.classList.remove('mole--show')
    $mole.classList.remove('mole--hit')
    void $mole.offsetWidth
    $mole.classList.add('mole--hit')

    const $points = document.createElement('span')
    $points.className = 'hit-points'
    $points.textContent = `+${points}`
    $points.setAttribute('aria-hidden', 'true')
    $points.addEventListener('animationend', () => $points.remove(), { once: true })
    $cell.append($points)

    clearTimeout(this.flashTimers[i])
    this.flashTimers[i] = setTimeout(() => {
      $mole.classList.remove('mole--hit')
    }, 180)
  }

  makeGrid(size) {
    size **= 2
    this.grid = new Array(size).fill(0)
  }
}
