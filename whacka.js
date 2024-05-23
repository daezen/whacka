import { qsa } from './helpers.js'
import Board from './board.js'

export default class Whacka {
  constructor(time, size = 3, moles = 3) {
    this.board = new Board(size)
    this.$moles = qsa('.mole')
    this.moles = new Map()
    this.time = time
    this.score = 0
    this.amountOfMoles = moles
  }

  loop() {
    this.updateMoles()
    window.requestAnimationFrame(() => this.loop())
  }

  start() {
    for (let i = 0; i < this.amountOfMoles; i++) this.pickMole()
    this.loop()
  }

  pickMole() {
    const i = Math.floor(Math.random() * this.board.size ** 2)
    if (this.board.grid[i] === 1) return this.pickMole()
    this.board.grid[i] = 1
    this.hideMole(i)
  }

  hideMole(i) {
    const timeToHide = 1000 // milliseconds

    setTimeout(() => {
      if (this.board.grid[i] === 1) {
        this.board.grid[i] = 0
      }
    }, timeToHide)
  }

  missedHit() {
    this.score -= 3
  }

  updateMoles() {
    const size = this.board.size ** 2

    for (let i = 0; i < size; i++) {
      const mole = this.$moles[i]

      if (this.board.grid[i] === 1) {
        mole.classList.add('mole--show')
      } else mole.classList.remove('mole--show')
    }
  }

  timer(isStart) {
    const interval = 1000 // 1 second in milliseconds
    if (isStart) {
      this.intervalId = setInterval(() => {
        this.time--
      }, interval)
    }

    if (!isStart) clearInterval(this.intervalId)
  }
}
