import { qsa, $on } from './helpers.js'
import Board from './board.js'

class Whacka {
  constructor() {
    this.dbHide = this.db(this.hideMole, 2000)
    this.board = new Board(3)
    this.$moles = qsa('.mole')
    this.currentMoles = []
    this.molesHx = []
    this.update()
  }

  update() {
    this.updateMoles()
    window.requestAnimationFrame(() => this.update())
  }

  start(moles) {
    for (let i = 0; i < moles; i++) this.pickMole()
  }

  pickMole() {
    const size = this.board.size ** 2
    const i = Math.floor(Math.random() * size)
    if (this.molesHx.includes(i)) return this.pickMole()
    if (this.board.grid[i] === 1) return this.pickMole()
    this.updateCurrentMoles(i)
    this.board.grid[i] = 1
    this.dbHide()
  }

  hideMole() {
    this.board.grid[this.currentMoles[0]] = 0
    this.pickMole()
  }

  hitMole(i) {
    if (this.board.grid[i] === 0) return
    this.board.grid[i] = 0
    this.updateMolesHx(i)
    this.pickMole()
  }

  updateMoles() {
    this.$moles.forEach(mole => mole.classList.remove('mole--show'))
    const size = this.board.size * this.board.size
    for (let i = 0; i < size; i++) {
      const mole = this.$moles[i]
      if (this.board.grid[i] === 1) mole.classList.add('mole--show')
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
    const hxLength = 3
    if (this.currentMoles.length < hxLength) this.currentMoles.push(n)
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

function ready() {
  const game = new Whacka()
  const $moles = qsa('.mole-hole')
  $moles.forEach((mole, index) => $on(mole, 'mousedown', () => game.hitMole(index)))
  game.start(3)
}

ready()
