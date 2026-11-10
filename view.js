import { qs } from './helpers.js'

const CONTROLS = `
  <div class="controls">
    <p class="controls__goal">
      Whack as many moles as you can in 30 seconds.
    </p>
    <ul class="controls__list">
      <li><span class="controls__key">Tap</span> a mole to whack it</li>
      <li class="controls__keyboard">
        <span class="controls__key">1–9</span> hit a hole by position
      </li>
      <li class="controls__keyboard">
        <span class="controls__key">Esc</span> pause or resume
      </li>
      <li class="controls__keyboard">
        <span class="controls__key">Space</span> restart
      </li>
      <li class="controls__touch">
        <span class="controls__key">⏸ ↻</span> pause or restart anytime
      </li>
    </ul>
  </div>`

const PAUSE_HINT = `
  <p class="controls controls--hint">
    <span class="controls__keyboard">Esc to resume · Space to restart</span>
    <span class="controls__touch">Tap Resume or Restart</span>
  </p>`

export default class View {
  constructor($timer, $overlay, $score) {
    this.$timer = $timer
    this.$overlay = $overlay
    this.$score = $score
    this.$gameActions = qs('.game-actions')
    this.best = 0
    this.score = null
  }

  setPlaying(isPlaying) {
    if (this.$gameActions) this.$gameActions.hidden = !isPlaying
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
    const $countdown = qs('.countdown', this.$overlay)
    if ($countdown) {
      const $number = qs('.countdown__number', $countdown)
      if ($number) $number.textContent = value
      else $countdown.textContent = value
      return
    }
    this.setHtml(
      `<div class="countdown" aria-live="assertive" aria-atomic="true"><span class="countdown__number">${value}</span></div>`,
    )
  }

  showScoreOverlay(score) {
    this.toggleOverlay(true)
    this.setHtml(`
      <div class="score-overlay">
        <p>Final Score: ${score}</p>
        <p class="best">Best: ${this.best}</p>
        <button class="play-again" type="button">Play again</button>
        ${CONTROLS}
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
        ${PAUSE_HINT}
      </div>`)
  }

  setHtml(htmlString) {
    this.$overlay.innerHTML = htmlString
  }
}
