export default class Loop {
  constructor(updateCallback) {
    this.updateCallback = updateCallback
    this.ms = 0
    this.oldTs = 0
    this.time = 0
    this.toContinue = false
    this.frame = timestamp => this.loop(timestamp)
  }

  loop(timestamp) {
    if (!this.toContinue) return
    this.ms = timestamp - this.oldTs
    this.oldTs = timestamp
    this.time += this.ms
    this.updateCallback()
    if (this.toContinue) this.animationId = requestAnimationFrame(this.frame)
  }

  start() {
    if (this.toContinue) return
    this.toContinue = true
    this.oldTs = performance.now()
    this.animationId = requestAnimationFrame(this.frame)
  }

  stop() {
    this.toContinue = false
    cancelAnimationFrame(this.animationId)
  }

  resetTime() {
    this.time = 0
  }
}
