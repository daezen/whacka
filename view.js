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
    this.$timer.textContent = `Time: ${time}s`
  }

  setScore(score) {
    this.$score.textContent = `Score: ${score}`
  }

  showScoreOverlay(score) {
    let htmlString = `<div class="score-overlay"><p>Final Score: ${score}</p><button class="play-again">Play again</button></div>`
    this.setHtml(htmlString)
  }

  toggleMenu(toShow) {
    this.toggleOverlay(toShow)
    let htmlString = `<div><p>Paused</p></div>`
    this.setHtml(htmlString)
  }

  setHtml(htmlString) {
    this.$overlay.innerHTML = `${htmlString}`
  }
}
