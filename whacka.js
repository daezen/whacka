import { qsa, qs } from './helpers.js'
import Board from './board.js'
import Loop from './loop.js'
import View from './view.js'

export default class Whacka {
  constructor(time, size = 3, amountOfMoles = 3) {
    this.view = new View(qs('[data-time]'), qs('.overlay'), qs('.score'))
    this.loop = new Loop(() => this.update())
    this.size = size
    this.board = new Board(this.size)
    this.time = time
    this.timer = time
    this.score = 0
    this.lastMole = null
    this.currMoles = []
    this.msToHide = 500
    this.visibleMoles = 0
    this.msSinceLastHidden = 0
    this.$moles = qsa('.mole')
    this.amountOfMoles = amountOfMoles
    this.view.setTime(time)
  }

  timerInterval(start) {
    if (start) {
      this.intervalId = setInterval(() => {
        this.timer--
      }, 1000)
    }
    if (!start) clearTimeout(this.intervalId)
    this.view.setTime(this.timer)
  }

  start() {
    for (let i = 0; i < this.amountOfMoles; i++) this.pickMole()
    this.view.toggleOverlay(false)
    this.timerInterval(true)
    this.loop.start()
  }

  stop() {
    this.view.toggleOverlay(true)
    this.loop.stop()
    this.view.showScoreOverlay(this.score)
    this.timerInterval(false)
  }

  reset() {
    this.score = 0
    this.timer = this.time
    this.lastMole = null
    this.currMoles = []
    this.visibleMoles = 0
    this.board = new Board(this.size)
    this.$moles = qsa('.mole')
    this.start()
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
    this.lastMole = i
    this.loop.resetTime()
    this.score -= 7
  }

  hitMole(i) {
    if (this.board.grid[i] === 0) return (this.score -= 5)
    this.board.grid[i] = 0
    this.lastMole = i
    this.loop.resetTime()
    this.updateCurrMoles(i, true)
    this.score += 10
  }

  hitBoard() {
    this.score -= 5
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

    if (this.loop.time >= this.msToHide) {
      this.hideMole(this.currMoles[0])
    }

    this.showMoles()

    if (this.visibleMoles < 3) {
      this.pickMole()
    }
    if (this.score < 0) this.score = 0

    if (this.timer === 0) {
      this.stop()
    }
  }
}
