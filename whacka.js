import { qsa, qs } from './helpers.js'
import Board from './board.js'
import Loop from './loop.js'
import View from './view.js'

export default class Whacka {
  constructor(time, size = 3, amountOfMoles = 3) {
    this.view = new View(qs('[data-time]'), qs('.overlay'), qs('.score'))
    this.loop = new Loop(() => this.update())
    this.board = new Board(size)
    this.time = time
    this.score = 0
    this.lastMole
    this.currMoles = []
    this.msToHide = 1000
    this.visibleMoles = 0
    this.msSinceLastHidden = 0
    this.$moles = qsa('.mole')
    this.amountOfMoles = amountOfMoles
    this.view.setTime(this.time)
  }

  timer(toStart) {
    if (toStart) {
      this.intervalId = setInterval(() => {
        this.time--
        this.view.setTime(this.time)
      }, 1000)
    }

    if (!toStart) clearTimeout(this.intervalId)
  }

  start() {
    for (let i = 0; i < this.amountOfMoles; i++) this.pickMole()
    this.view.toggleOverlay(false)
    this.timer(true)
    this.loop.start()
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

  hideMole(i, wasHit) {
    if (this.board.grid[i] === 0) return
    this.board.grid[i] = 0
    this.lastMole = i
    this.loop.resetTime()
    if (wasHit) {
      this.updateCurrMoles(i, true)
      this.score += 10
    }
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
    this.view.setScore(this.score)
    this.visibleMoles = 0
    if (this.loop.time >= this.msToHide) this.hideMole(this.currMoles[0])

    this.showMoles()
    if (this.visibleMoles < 3) this.pickMole()
    if (this.view.time === 0) this.loop.stop()
  }
}
