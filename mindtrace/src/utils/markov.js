export const STATES = ['V', 'S', 'I', 'R', 'P', 'A', 'E']

export const STATE_LABELS = {
  V: 'VIEW', S: 'SCROLL', I: 'INTERACTION', R: 'REPETITIVE',
  P: 'PAUSE', A: 'APP SWITCH', E: 'EXIT',
}

export const STATE_DESCRIPTIONS = {
  V: 'User is consuming or observing content.',
  S: 'User scrolls or swipes through content without a distinct interaction.',
  I: 'A single identifiable action: like, comment, share, save.',
  R: 'REPETITIVE INTERACTION — inferred from a sequence of similar interactions.',
  P: 'No significant interaction for a configurable interval.',
  A: 'User switches to another app.',
  E: 'User ends the monitored app session. Absorbing by convention.',
}

export const ILLUSTRATIVE_MATRIX = {
  V: { V: 0.20, S: 0.55, I: 0.15, R: 0.00, P: 0.05, A: 0.03, E: 0.02 },
  S: { V: 0.10, S: 0.55, I: 0.15, R: 0.10, P: 0.05, A: 0.03, E: 0.02 },
  I: { V: 0.30, S: 0.25, I: 0.20, R: 0.10, P: 0.05, A: 0.07, E: 0.03 },
  R: { V: 0.05, S: 0.60, I: 0.15, R: 0.15, P: 0.02, A: 0.02, E: 0.01 },
  P: { V: 0.20, S: 0.35, I: 0.10, R: 0.05, P: 0.15, A: 0.10, E: 0.05 },
  A: { V: 0.50, S: 0.20, I: 0.05, R: 0.00, P: 0.05, A: 0.15, E: 0.05 },
  E: { V: 0.00, S: 0.00, I: 0.00, R: 0.00, P: 0.00, A: 0.00, E: 1.00 },
}

export const RAW_EVENT_TO_STATE = {
  OPEN: 'V', VIEW: 'V', SCROLL: 'S',
  LIKE: 'I', COMMENT: 'I', SHARE: 'I', SAVE: 'I',
  REPEAT_INTERACTION: 'R', PAUSE: 'P', APP_SWITCH: 'A', EXIT: 'E',
}

export function eventToState(t) { return RAW_EVENT_TO_STATE[t] ?? null }

export function applyRepetitiveRule(states, threshold = 3) {
  if (!Array.isArray(states) || states.length === 0) return []
  const out = states.slice()
  let i = 0
  while (i < out.length) {
    if (out[i] === 'I') {
      let runLen = 1
      let j = i + 1
      while (j < out.length && (out[j] === 'I' || out[j] === 'S' || out[j] === 'V')) {
        if (out[j] === 'I') runLen++
        j++
      }
      if (runLen >= threshold) {
        for (let k = i + 1; k < j; k++) if (out[k] === 'I') out[k] = 'R'
      }
      i = j
    } else i++
  }
  return out
}

export function emptyCounts() {
  const m = {}
  for (const s of STATES) { m[s] = {}; for (const t of STATES) m[s][t] = 0 }
  return m
}

export function countTransitions(states) {
  const c = emptyCounts()
  for (let i = 0; i < states.length - 1; i++) {
    const a = states[i], b = states[i + 1]
    if (STATES.includes(a) && STATES.includes(b)) c[a][b]++
  }
  return c
}

export function rowTotals(counts) {
  const t = {}
  for (const s of STATES) t[s] = STATES.reduce((a, x) => a + (counts[s][x] || 0), 0)
  return t
}

export function computeProbabilities(counts, minObs = 5) {
  const totals = rowTotals(counts)
  const probabilities = {}
  const insufficient = {}
  for (const s of STATES) {
    probabilities[s] = {}
    insufficient[s] = totals[s] < minObs
    if (totals[s] === 0) {
      for (const t of STATES) probabilities[s][t] = null
      continue
    }
    for (const t of STATES) probabilities[s][t] = counts[s][t] / totals[s]
  }
  return { probabilities, totals, insufficient }
}

export function analyseSequence(states, opts = {}) {
  const minRepeat = opts.minRepeat ?? 3
  let maxScrollRun = 0, scrollRun = 0, alternations = 0
  for (let i = 0; i < states.length; i++) {
    if (states[i] === 'S') { scrollRun++; maxScrollRun = Math.max(maxScrollRun, scrollRun) }
    else scrollRun = 0
    if (i >= 2 && states[i] === 'I' && states[i - 1] === 'S' && states[i - 2] === 'I') alternations++
  }
  const counts = countTransitions(states)
  const ss = counts['S']['S']

  const notes = []
  if (maxScrollRun >= minRepeat) notes.push(`Detected ${maxScrollRun} consecutive SCROLL events. Consecutive scrolling is a behavioural signal, not proof of doomscrolling.`)
  if (alternations >= 2) notes.push(`Detected ${alternations} S→I→S alternations. Repeated interaction between scrolls may indicate a repetitive pattern.`)
  if (notes.length === 0) notes.push('No dominant repetitive pattern detected in this session. This is not a diagnosis of any kind.')
  notes.push('A long session alone does not prove doomscrolling. Repetitive behaviour alone does not prove doomscrolling either.')

  let label = 'Varied Activity'
  if (states.length < 5) label = 'Insufficient Data'
  else if (ss >= minRepeat && alternations >= 2) label = 'Potential Doomscrolling Pattern'
  else if (ss >= minRepeat || alternations >= 2) label = 'Repetitive Pattern'

  return { label, maxScrollRun, alternations, counts, notes }
}

export function buildSequenceFromEvents(events, threshold = 3) {
  const raw = events.map((e) => eventToState(e.type)).filter(Boolean)
  return applyRepetitiveRule(raw, threshold)
}

export function probabilityToColor(p) {
  if (p === null || p === undefined) return 'rgb(243, 244, 246)'
  const c = Math.max(0, Math.min(1, p))
  const stops = [[244,246,251],[230,234,245],[205,211,234],[168,178,216],[107,116,184],[59,59,143]]
  const s = c * (stops.length - 1)
  const lo = Math.floor(s), hi = Math.min(stops.length - 1, lo + 1)
  const t = s - lo
  const rgb = stops[lo].map((v, i) => Math.round(v + (stops[hi][i] - v) * t))
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
}

export function textColorForProbability(p) {
  if (p === null || p === undefined) return '#6b7280'
  return p > 0.45 ? '#ffffff' : '#111133'
}
