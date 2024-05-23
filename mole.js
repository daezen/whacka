export default class Mole {
  constructor(i, hideCallback) {
    this.i = i
    this.hideCallback = hideCallback
    this.timeout = null
  }

  show() {
    const timeToHide = 1000 // milliseconds

    this.clearTimeout()
    this.timeout = setTimeout(() => this.hide(), timeToHide)
  }

  hide() {
    this.clearTimeout()
    this.hideCallback(this.i)
  }

  clearTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  }

  hit() {
    this.hide()
  }
} 
