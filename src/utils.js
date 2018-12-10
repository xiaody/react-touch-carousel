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

export function getTouchPosition (e) {
  return {
    x: e.changedTouches[0].pageX,
    y: e.changedTouches[0].pageY
  }
}

export function getTouchId (e) {
  return e.changedTouches[0].identifier
}

export function omit (obj, keys) {
  const ret = {}
  Object.keys(obj).forEach(k => {
    if (keys.includes(k)) return
    ret[k] = obj[k]
  })
  return ret
}

export function modCursor (cursor, cardCount) {
  let newCursor = cursor
  while (newCursor > 0) {
    newCursor -= cardCount
  }
  while (newCursor < 0.5 - cardCount) {
    newCursor += cardCount
  }
  return newCursor
}
