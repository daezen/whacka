import { qsa } from './helpers.js'
import Board from './board.js'
import Loop from './loop.js'

export default class Whacka {
  constructor(timer, size = 3, amountOfMoles = 3) {
    this.amountOfMoles = amountOfMoles
    this.board = new Board(size)
    this.$moles = qsa('.mole')
    this.loop = new Loop()
    this.timer = timer
    this.lastMole
    this.currMoles = []
    this.visibleMoles = 0
    this.lastMole
    this.oldTs = 0
    this.ms = 0
    this.time = 0
    this.timeToHide = 600 // milliseconds
  }

  start() {
    for (let i = 0; i < this.amountOfMoles; i++) this.pickMole()
    requestAnimationFrame(this.loop.bind(this))
  }

  showMoles() {
    this.$moles.forEach((mole, i) => {
      const isMole = this.board.grid[i] === 1
      mole.classList.toggle('mole--show', isMole)
      if (isMole) this.visibleMoles++
    })
  }

  pickMole() {
    let i
    do {
      i = Math.floor(Math.random() * this.board.size ** 2)
    } while (this.board.grid[i] === 1 || this.lastMole === i)
    this.board.grid[i] = 1
    this.updateCurrMoles(i)
  }

  hideMole(i) {
    if (this.board.grid[i] === 0) return
    this.board.grid[i] = 0
    this.time = 0
    this.lastMole = i
    this.updateCurrMoles(i, true)
  }

  updateCurrMoles(n, wasHit) {
    if (wasHit === true) {
      this.currMoles = this.currMoles.filter(mole => mole !== n)
      return
    }
    if (this.currMoles.length < this.amountOfMoles) this.currMoles.push(n)
    else {
      this.currMoles.shift()
      this.currMoles.push(n)
    }
  }

  update() {
    this.visibleMoles = 0
    if (this.time >= this.timeToHide) this.hideMole(this.currMoles[0])

    this.showMoles()
    if (this.visibleMoles < 3) this.pickMole()
  }
}
