import { qsa, qs } from './helpers.js'
import Board from './board.js'
import Loop from './loop.js'
import View from './view.js'

export default class Whacka {
  constructor(
    time,
    size = 3,
    amountOfMoles = 3,
    $view = {
      $time: '[data-time]',
      $overlay: '.overlay',
      $score: '.score',
    },
  ) {
    if (amountOfMoles > size * size) {
      throw new Error('amountOfMoles cannot exceed available cells (size²)')
    }
    this.size = size
    this.view = new View(qs($view.$time), qs($view.$overlay), qs($view.$score))
    this.loop = new Loop(() => this.update())
    this.board = new Board(this.size, i => this.hitMole(i))
    this.time = time
    this.timer = time
    this.score = 0
    this.lastMole = null
    this.currMoles = []
    this.msToHide = 900
    this.msSinceLastHidden = 0
    this.$moles = qsa('.mole')
    this.amountOfMoles = amountOfMoles
    this.view.setTime(time)
    this.intervalId = null
    this.paused = false
    this.running = false
  }

  timerInterval(start) {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    if (start) {
      this.intervalId = setInterval(() => {
        if (this.paused) return
        this.timer--
        this.view.setTime(this.timer)
      }, 1000)
    }
    if (!start) clearInterval(this.intervalId)
  }

  start() {
    this.running = true
    this.paused = false
    for (let i = 0; i < this.amountOfMoles; i++) this.pickMole()
    this.view.toggleOverlay(false)
    this.loop.resetTime()
    this.timerInterval(true)
    this.loop.start()
  }

  pause(toToggle) {
    this.paused = toToggle
    if (this.paused) {
      this.view.toggleMenu(true)
    } else {
      this.view.toggleMenu(false)
    }
  }

  togglePause() {
    if (!this.running) return
    this.pause(!this.paused)
  }

  stop(showScore = true) {
    this.running = false
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }

    this.view.toggleOverlay(true)
    this.loop.stop()

    if (showScore) {
      this.view.showScoreOverlay(this.score)
    }
  }

  reset() {
    this.stop(false)
    this.score = 0
    this.timer = this.time
    this.lastMole = null
    this.currMoles = []
    this.visibleMoles = 0
    this.paused = false
    this.board = new Board(this.size, i => this.hitMole(i))
    this.$moles = qsa('.mole')
    this.view.setTime(this.timer)
    this.$moles.forEach(mole => mole.classList.remove('mole--show'))
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
    this.score = Math.max(0, this.score - 6)
  }

  hitMole(i) {
    if (this.board.grid[i] === 0)
      return (this.score = Math.max(0, this.score - 5))
    this.board.grid[i] = 0
    this.lastMole = i
    this.loop.resetTime()
    this.updateCurrMoles(i, true)
    this.score += 10
  }

  hitBoard() {
    this.score = Math.max(0, this.score - 5)
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
    if (this.paused) return
    this.view.setScore(this.score)
    this.visibleMoles = 0

    if (this.loop.time >= this.msToHide) {
      this.hideMole(this.currMoles[0])
    }

    this.showMoles()

    if (this.visibleMoles < this.amountOfMoles) {
      this.pickMole()
    }

    if (this.timer === 0) {
      this.stop()
    }
  }
}
