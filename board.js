import { qs } from '/helpers.js'

export default class Board {
  constructor(size) {
    this.$board = qs('.board')
    this.size = 3 || size
    this.grid(this.size)
  }

  grid(size) {
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
  }
}
