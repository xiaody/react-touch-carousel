export function range (start, end) {
  const ret = []
  for (let i = start; i <= end; i++) {
    ret.push(i)
  }
  return ret
}

export function clamp (n, min, max) {
  if (n < min) {
    return min
  }
  if (n > max) {
    return max
  }
  return n
}

export function precision (n, p) {
  return Math.round(n / p) * p
}

export function getTouchPosition (e) {
  return {
    x: e.changedTouches[0].pageX,
    y: e.changedTouches[0].pageY
  }
}

export function getTouchId (e) {
  return e.changedTouches[0].identifier
}
