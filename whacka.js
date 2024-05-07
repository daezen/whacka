import { qs, qsa } from './helpers.js'
import Board from './board.js'

export default class Whacka {
  constructor(time, size = 3, moles = 3) {
    this.dbHide = this.db(this.hideMole, 1000)
    this.board = new Board(size)
    this.$moles = qsa('.mole')
    this.moles = moles
    this.currentMoles = []
    this.molesHx = []
    this.time = time
    this.score = 0
  }

  update() {
    qs('[data-time]').textContent = `time: ${this.time}s`
    qs('.score').textContent = `score: ${this.score}`
    this.updateMoles()
    if (this.time === 0) return this.end()
    window.requestAnimationFrame(() => this.update())
  }

  start() {
    for (let i = 0; i < this.moles; i++) this.pickMole()
    this.timer(true)
    this.update()
  }

  end() {
    const overlay = qs('.overlay')
    overlay.removeAttribute('style')
    overlay.innerHTML = `<p>${this.score}<p>`
    this.timer(false)
  }

  timer(isStart) {
    if (isStart) {
      this.intervalId = setInterval(() => {
        this.time--
      }, 1000)
    }
    if (!isStart) clearInterval(this.intervalId)
  }

  pickMole() {
    const i = Math.floor(Math.random() * this.board.size ** 2)
    if (this.molesHx.includes(i) || this.board.grid[i] === 1) return this.pickMole()
    this.updateCurrentMoles(i)
    this.board.grid[i] = 1
    this.dbHide()
  }

  hideMole() {
    const i = this.currentMoles[0]
    this.board.grid[i] = 0
    this.updateMolesHx(i)
    this.pickMole()
    this.score -= 7
  }

  hitMole(i) {
    if (this.board.grid[i] === 0) return
    this.board.grid[i] = 0
    this.updateMolesHx(i)
    this.pickMole()
    this.score += 10
  }

  missedHit() {
    this.score -= 3
  }

  updateMoles() {
    const size = this.board.size * this.board.size
    for (let i = 0; i < size; i++) {
      const mole = this.$moles[i]
      if (this.board.grid[i] === 1) mole.classList.add('mole--show')
      else mole.classList.remove('mole--show')
    }
  }

  updateMolesHx(n) {
    const hxLength = 1
    if (this.molesHx.length < hxLength) {
      this.molesHx.push(n)
    } else {
      this.molesHx.shift()
      this.molesHx.push(n)
    }
  }

  updateCurrentMoles(n) {
    const arrayLength = 3
    if (this.currentMoles.length < arrayLength) this.currentMoles.push(n)
    else {
      this.currentMoles.shift()
      this.currentMoles.push(n)
    }
  }

  db(func, delay) {
    let timerId
    return function (...args) {
      clearTimeout(timerId)
      timerId = setTimeout(() => {
        func.apply(this, args)
      }, delay)
    }
  }
}
