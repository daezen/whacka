function qsa(selector, scope) {
  return (scope || document).querySelectorAll(selector)
}

const $on = (target, type, callback, useCapture) => {
  target.addEventListener(type, callback, !!useCapture)
}

function qs(selector, scope) {
  return (scope || document).querySelector(selector)
}

export { qsa, qs, $on }
