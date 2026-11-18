import { qsa, qs } from './helpers.js'
import Board from './board.js'
import Loop from './loop.js'
import Sound from './audio.js'
import View from './view.js'

const BEST_KEY = 'whacka:best'
const DURATION_KEY = 'whacka:duration'
const ROUND_DURATIONS = [15, 30, 60]
const COUNTDOWN_STEP = 700
export const HIT_POINTS = 10
const HITS_PER_BONUS = 5
const STREAK_BONUS_POINTS = 2
// Keep a hit hole empty long enough for the drop/flash animation to finish.
const HIT_RESPAWN_DELAY = 500

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
    this.view = new View(qs($view.$time), qs($view.$overlay), qs($view.$score), ROUND_DURATIONS)
    this.sound = new Sound()
    this.loop = new Loop(() => this.update())
    this.board = new Board(this.size, i => this.hitMole(i))
    this.holeCooldowns = new Array(size * size).fill(0)
    this.duration = this.loadDuration(time)
    this.time = this.duration
    this.timer = this.time
    this.score = 0
    this.streak = 0
    this.bestByDuration = new Map()
    this.best = this.loadBest()
    this.view.setBest(this.best)
    this.view.showStart(this.time)
    this.lastMole = null
    this.currMoles = []
    this.visibleMoles = 0
    this.msToHide = 900
    this.msSinceLastHidden = 0
    this.$moles = qsa('.mole')
    this.amountOfMoles = amountOfMoles
    this.view.setTime(this.timer)
    this.timerId = null
    this.tickRemaining = 1000
    this.paused = false
    this.running = false
    this.countingDown = false
    this.countdownValue = 3
    this.countdownId = null
  }

  loadDuration(fallback) {
    try {
      const duration = Number(localStorage.getItem(DURATION_KEY))
      if (ROUND_DURATIONS.includes(duration)) return duration
    } catch {
      // Use the default when storage is unavailable.
    }
    return fallback
  }

  setDuration(duration) {
    if (this.running || !ROUND_DURATIONS.includes(duration)) return
    this.duration = duration
    try {
      localStorage.setItem(DURATION_KEY, String(duration))
    } catch {
      // The selection still applies for this session.
    }
    if (this.view.$overlay.querySelector('.start-button')) {
      this.time = this.timer = duration
      this.best = this.loadBest()
      this.view.setBest(this.best)
      this.view.setTime(this.timer)
    }
  }

  get bestKey() {
    return this.time === 30 ? BEST_KEY : `${BEST_KEY}:${this.time}`
  }

  loadBest() {
    const sessionBest = this.bestByDuration.get(this.time) ?? 0
    try {
      return Math.max(sessionBest, Number(localStorage.getItem(this.bestKey)) || 0)
    } catch {
      return sessionBest
    }
  }

  saveBest() {
    this.bestByDuration.set(this.time, this.best)
    try {
      localStorage.setItem(this.bestKey, String(this.best))
    } catch {
      // Storage can be unavailable; the best score just won't persist.
    }
  }

  updateBest() {
    if (this.score <= this.best) return
    this.best = this.score
    this.saveBest()
    this.view.setBest(this.best)
  }

  scheduleTimerTick() {
    this.nextTickAt = performance.now() + this.tickRemaining
    this.timerId = setTimeout(() => {
      this.timerId = null
      this.timer--
      this.view.setTime(this.timer)
      if (this.timer === 0) {
        this.stop()
        return
      }
      this.tickRemaining = 1000
      this.scheduleTimerTick()
    }, this.tickRemaining)
  }

  start() {
    this.cancelCountdown()
    this.running = true
    this.paused = false
    this.countingDown = true
    this.countdownValue = 3
    this.view.setPlaying(false)
    this.view.showCountdown(this.countdownValue)
    // Schedule first so an audio failure can never stall the countdown.
    this.countdownId = setTimeout(() => this.tickCountdown(), COUNTDOWN_STEP)
    this.sound.tick()
  }

  tickCountdown() {
    this.countdownValue--
    if (this.countdownValue > 0) {
      this.view.showCountdown(this.countdownValue)
      this.countdownId = setTimeout(() => this.tickCountdown(), COUNTDOWN_STEP)
      this.sound.tick()
      return
    }
    this.beginRound()
  }

  beginRound() {
    this.countdownId = null
    this.countingDown = false
    for (let i = 0; i < this.amountOfMoles; i++) this.pickMole()
    this.view.toggleOverlay(false)
    this.view.setPlaying(true)
    this.loop.resetTime()
    this.tickRemaining = 1000
    this.scheduleTimerTick()
    this.loop.start()
    // If the tab went to the background during the countdown, pause right away.
    if (document.hidden) this.pause(true)
    else this.sound.go()
  }

  cancelCountdown() {
    if (this.countdownId) {
      clearTimeout(this.countdownId)
      this.countdownId = null
    }
    this.countingDown = false
  }

  pause(toToggle) {
    this.paused = toToggle
    if (this.paused) {
      this.tickRemaining = Math.max(0, this.nextTickAt - performance.now())
      clearTimeout(this.timerId)
      this.timerId = null
      this.loop.stop()
      this.view.showPause()
      this.view.setPlaying(false)
    } else {
      this.scheduleTimerTick()
      this.loop.start()
      this.view.toggleOverlay(false)
      this.view.setPlaying(true)
    }
  }

  togglePause() {
    if (!this.running || this.countingDown) return
    this.pause(!this.paused)
  }

  stop(showScore = true) {
    if (this.running) this.updateBest()
    this.cancelCountdown()
    this.running = false
    this.paused = false
    clearTimeout(this.timerId)
    this.timerId = null

    this.view.toggleOverlay(true)
    this.view.setPlaying(false)
    this.loop.stop()

    if (showScore) {
      this.view.showScoreOverlay(this.score, this.duration)
      this.sound.over()
    }
  }

  reset() {
    this.stop(false)
    this.time = this.duration
    this.best = this.loadBest()
    this.view.setBest(this.best)
    this.score = 0
    this.streak = 0
    this.timer = this.time
    this.lastMole = null
    this.currMoles = []
    this.visibleMoles = 0
    this.paused = false
    this.board = new Board(this.size, i => this.hitMole(i))
    this.holeCooldowns = new Array(this.size ** 2).fill(0)
    this.$moles = qsa('.mole')
    this.view.setTime(this.timer)
    this.view.setScore(this.score)
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
    const now = performance.now()
    const available = []
    for (let i = 0; i < this.board.grid.length; i++) {
      if (this.board.grid[i] === 1) continue
      if (this.holeCooldowns[i] > now) continue
      available.push(i)
    }

    // Prefer any hole other than the last one used, but fall back if it is the
    // only option so picking can never get stuck.
    const fresh = available.filter(i => i !== this.lastMole)
    const pool = fresh.length > 0 ? fresh : available
    if (pool.length === 0) return

    const i = pool[Math.floor(Math.random() * pool.length)]
    this.board.grid[i] = 1
    this.updateCurrMoles(i)
  }

  hideMole(i) {
    if (this.board.grid[i] !== 1) return
    this.board.grid[i] = 0
    this.updateCurrMoles(i, true)
    this.lastMole = i
    this.loop.resetTime()
    this.streak = 0
    this.score = Math.max(0, this.score - 6)
    this.sound.escape()
  }

  hitMole(i) {
    if (!this.running || this.paused || this.countingDown) return
    if (this.board.grid[i] === 0) {
      this.hitBoard()
      return
    }
    this.board.grid[i] = 0
    this.lastMole = i
    this.holeCooldowns[i] = performance.now() + HIT_RESPAWN_DELAY
    this.loop.resetTime()
    this.updateCurrMoles(i, true)
    this.streak++
    const earnedBonus = this.streak % HITS_PER_BONUS === 0
    const points = HIT_POINTS + (earnedBonus ? STREAK_BONUS_POINTS : 0)
    this.score += points
    this.board.flashMole(i, points)
    this.sound.hit(earnedBonus)
  }

  debugSpawnAll() {
    if (!this.running || this.paused || this.countingDown) return
    this.board.grid.fill(1)
    this.currMoles = this.board.grid.map((_, i) => i)
    this.$moles.forEach(mole => mole.classList.remove('mole--hit'))
    this.visibleMoles = 0
    this.showMoles()
    this.loop.resetTime()
  }

  hitBoard() {
    if (!this.running || this.paused || this.countingDown) return
    this.streak = 0
    this.sound.miss()
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
  }
}
