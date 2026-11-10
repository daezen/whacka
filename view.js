import { qs } from './helpers.js'

const CONTROLS =
  'Click or tap a mole · 1–9 hit a hole · Esc pause · Space restart'

export default class View {
  constructor($timer, $overlay, $score) {
    this.$timer = $timer
    this.$overlay = $overlay
    this.$score = $score
    this.best = 0
    this.score = null
  }

  toggleOverlay(toShow) {
    if (!toShow) {
      if (this.$overlay.contains(document.activeElement)) {
        document.activeElement.blur()
      }
      this.$overlay.style.display = 'none'
    }
    if (toShow) this.$overlay.removeAttribute('style')
  }

  setTime(time) {
    this.$timer.textContent = `Time: ${time}s`
    this.$timer.classList.toggle('time--low', time <= 5)
  }

  setScore(score) {
    if (this.score === score) return
    this.score = score
    this.$score.textContent = `Score: ${score}`
  }

  setBest(best) {
    this.best = best
    const $best = qs('[data-best]', this.$overlay)
    if ($best) $best.textContent = `Best: ${best}`
  }

  showCountdown(value) {
    this.toggleOverlay(true)
    this.setHtml(`<div class="countdown" aria-live="assertive">${value}</div>`)
  }

  showScoreOverlay(score) {
    this.toggleOverlay(true)
    this.setHtml(`
      <div class="score-overlay">
        <p>Final Score: ${score}</p>
        <p class="best">Best: ${this.best}</p>
        <button class="play-again" type="button">Play again</button>
        <p class="controls">${CONTROLS}</p>
      </div>`)
  }

  showPause() {
    this.toggleOverlay(true)
    this.setHtml(`
      <div class="menu">
        <p>Paused</p>
        <div class="menu-actions">
          <button class="resume-button" type="button">Resume</button>
          <button class="restart-button" type="button">Restart</button>
        </div>
        <p class="best">Best: ${this.best}</p>
        <p class="controls">Esc resume · Space restart</p>
      </div>`)
  }

  setHtml(htmlString) {
    this.$overlay.innerHTML = htmlString
  }
}
