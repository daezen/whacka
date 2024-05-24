import { qsa } from './helpers.js'
import Board from './board.js'

export default class Whacka {
  constructor(time, size = 3, amountOfMoles = 3) {
    this.board = new Board(size)
    this.$moles = qsa('.mole')
    this.moles = new Map()
    this.time = time
    this.score = 0
    this.amountOfMoles = amountOfMoles
    this.lastMoles = []
    this.visibleMoles = 0
  }

  loop(timestamp) {
    const timeElapsted = timestamp
    console.log(timeElapsted)
    this.updateMoles()
    requestAnimationFrame(() => this.loop())
  }

  start() {
    for (let i = 0; i < this.amountOfMoles; i++) this.pickMole()
    this.loop()
  }

  pickMole() {
    let i
    do {
      i = Math.floor(Math.random() * this.board.size ** 2)
    } while (this.board.grid[i] === 1 || this.lastMoles.includes(i))
    this.board.grid[i] = 1
    this.updateLastMoles(i)
  }

  hideMole(i) {
    if (this.board.grid[i] === 1) {
      this.board.grid[i] = 0
    }
  }

  hitMole(i) {
    this.hideMole(i)
  }

  autoHide() {
    const i = this.lastMoles[2]
    this.hideMole(i)
  }

  updateLastMoles(i) {
    const length = 4
    if (this.lastMoles.length === length) {
      this.lastMoles.pop()
    }
    this.lastMoles.unshift(i)
  }

  updateMoles() {
    this.visibleMoles = 0
    this.$moles.forEach((mole, i) => {
      const isMole = this.board.grid[i] === 1
      mole.classList.toggle('mole--show', isMole)
      if (isMole) this.visibleMoles++
    })
    if (this.visibleMoles < 3) this.pickMole()
  }
}
