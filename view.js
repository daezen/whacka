export default class View {
  constructor($timer, $overlay, $score) {
    this.$timer = $timer
    this.$overlay = $overlay
    this.$score = $score
  }

  toggleOverlay(toShow) {
    if (!toShow) this.$overlay.style.display = 'none'
    if (toShow) this.$overlay.removeAttribute('style')
  }

  setTime(time) {
    this.$timer.textContent = `time: ${time}s`
  }

  setScore(score) {
    this.$score.textContent = `score: ${score}`
  }
}
