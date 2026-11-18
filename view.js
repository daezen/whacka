import { qs } from './helpers.js'

const PLAY_HINT = {
  keyboard: 'Click a mole to whack it · Esc to pause · Space to restart',
  touch: 'Tap a mole to whack it · Use ⏸ or ↻ to pause or restart',
}

const PAUSE_HINT = {
  keyboard: 'Esc to resume · Space to restart',
  touch: 'Tap Resume or Restart',
}

const RESULTS_HINT = {
  keyboard: 'Select Play again or press Space',
  touch: 'Tap Play again',
}

export default class View {
  constructor($timer, $overlay, $score, durations) {
    this.$timer = $timer
    this.$overlay = $overlay
    this.$score = $score
    this.durations = durations
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

  showStart(time) {
    this.showMenu(
      'Whack as many moles as you can.',
      '<button class="menu-button start-button" type="button">Start</button>',
      PLAY_HINT,
      time,
    )
  }

  showScoreOverlay(score, duration) {
    this.showMenu(
      `Final Score: ${score}`,
      '<button class="menu-button play-again" type="button">Play again</button>',
      RESULTS_HINT,
      duration,
    )
  }

  showPause() {
    this.showMenu(
      'Paused',
      `<button class="menu-button resume-button" type="button">Resume</button>
       <button class="menu-button menu-button--secondary restart-button" type="button">Restart</button>`,
      PAUSE_HINT,
    )
  }

  showMenu(title, actions, hint, duration) {
    const settings = duration === undefined ? '' : `
      <label class="menu__setting">
        Round length
        <select data-duration>
          ${this.durations.map(seconds => `
            <option value="${seconds}"${seconds === duration ? ' selected' : ''}>${seconds} seconds</option>
          `).join('')}
        </select>
      </label>`
    this.setHtml(`
      <div class="menu">
        <h2 class="menu__title">${title}</h2>
        <div class="menu__content">
          <div class="menu-actions">${actions}</div>
          <p class="best" data-best>Best: ${this.best}</p>
          ${settings}
        </div>
        <p class="menu__hint">
          <span class="controls__keyboard">${hint.keyboard}</span>
          <span class="controls__touch">${hint.touch}</span>
        </p>
      </div>`)
    this.toggleOverlay(true)
  }

  setHtml(htmlString) {
    this.$overlay.innerHTML = htmlString
  }
}
