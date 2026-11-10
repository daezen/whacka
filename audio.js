const MUTED_KEY = 'whacka:muted'

export default class Sound {
  constructor() {
    this.ctx = null
    this.muted = this.loadMuted()
  }

  loadMuted() {
    try {
      return localStorage.getItem(MUTED_KEY) === '1'
    } catch {
      return false
    }
  }

  saveMuted() {
    try {
      localStorage.setItem(MUTED_KEY, this.muted ? '1' : '0')
    } catch {
      // Storage can be unavailable (e.g. private mode); sound still works this session.
    }
  }

  toggle() {
    this.muted = !this.muted
    this.saveMuted()
    return this.muted
  }

  unlock() {
    const ctx = this.ensure()
    if (ctx && ctx.state === 'suspended') ctx.resume()
  }

  ensure() {
    if (this.ctx) return this.ctx
    const Ctx = globalThis.AudioContext || globalThis.webkitAudioContext
    if (!Ctx) return null
    this.ctx = new Ctx()
    return this.ctx
  }

  tone(freq, duration = 0.09, type = 'sine', volume = 0.05, endFreq = freq) {
    if (this.muted) return
    const ctx = this.ensure()
    if (!ctx) return
    if (ctx.state === 'suspended') ctx.resume()

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = type
    osc.frequency.setValueAtTime(freq, now)
    if (endFreq !== freq) {
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration)
    }

    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + duration + 0.02)
  }

  tick() {
    this.tone(520, 0.06, 'square', 0.035)
  }

  go() {
    this.tone(780, 0.12, 'square', 0.05, 1040)
  }

  hit() {
    this.tone(880, 0.07, 'square', 0.06, 1320)
  }

  miss() {
    this.tone(180, 0.12, 'sawtooth', 0.05, 90)
  }

  escape() {
    this.tone(260, 0.12, 'triangle', 0.035, 140)
  }

  over() {
    this.tone(320, 0.25, 'sine', 0.05, 120)
  }
}
