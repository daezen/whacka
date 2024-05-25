export default class Loop {
  constructor() {
    this.ms
    this.oldTs
    this.time
  }

  loop(timestamp) {
    this.ms = timestamp - this.oldTs
    this.oldTs = timestamp
    this.time += this.ms
    this.update()
    requestAnimationFrame(this.loop.bind(this))
  }
}
