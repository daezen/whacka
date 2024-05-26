export default class Loop {
  constructor(updateCallback) {
    this.updateCallback = updateCallback
    this.ms = 0
    this.oldTs = 0
    this.time = 0
    this.toContinue = true
  }

  loop(timestamp) {
    if (!this.toContinue) return
    this.ms = timestamp - this.oldTs
    this.oldTs = timestamp
    this.time += this.ms
    this.updateCallback()
    this.animationId = requestAnimationFrame(this.loop.bind(this))
  }

  start() {
    this.toContinue = true
    this.oldTs = performance.now()
    this.animationId = requestAnimationFrame(this.loop.bind(this))
  }

  stop() {
    this.toContinue = false
  }

  resetTime() {
    this.time = 0
  }
}
