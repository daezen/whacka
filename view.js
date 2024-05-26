export default class View {
  constructor($timer, $overlay, time) {
    this.$timer = $timer
    this.$overlay = $overlay
    this.time = time
    this.$timer.textContent = `time: ${this.time}s`
  }

  toggleOverlay(toShow) {
    if (!toShow) this.$overlay.style.display = 'none'
    if (toShow) this.$overlay.removeAttribute('style')
  }

  timer(toStart) {
    if (toStart) {
      this.intervalId = setInterval(() => {
        this.time--
        this.$timer.textContent = `time: ${this.time}s`
      }, 1000)
    }

    if (!toStart) clearTimeout(this.intervalId)
  }
}
