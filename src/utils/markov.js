// ---------------------------------------------------------------------------
// MindTrace Markov utilities
// ---------------------------------------------------------------------------
// NOTE: Everything here operates on synthetic / demo data. These helpers are
// pure functions and are intentionally framework-agnostic so the same module
// can be reused by a future backend or an Android event pipeline.
// ---------------------------------------------------------------------------

export const STATES = ['V', 'S', 'I', 'R', 'P', 'A', 'E']

export const STATE_LABELS = {
  V: 'VIEW',
  S: 'SCROLL',
  I: 'INTERACTION',
  R: 'REPETITIVE',
  P: 'PAUSE',
  A: 'APP SWITCH',
  E: 'EXIT',
}

export const STATE_DESCRIPTIONS = {
  V: 'User is consuming or observing content (opened a post, watched a video).',
  S: 'User scrolls or swipes through content without a distinct interaction.',
  I: 'A single identifiable action: like, comment, share, save.',
  R: 'REPETITIVE INTERACTION — inferred from a sequence of similar interactions using a configurable rule. Not a raw event.',
  P: 'No significant interaction for a configurable interval.',
  A: 'User switches to another app.',
  E: 'User ends the monitored app session. Modelled as absorbing (P(E→E)=1) by convention.',
}

// The illustrative matrix from the brief. Labelled clearly in the UI as
// hypothetical demonstration data — do NOT claim these were measured.
export const ILLUSTRATIVE_MATRIX = {
  V: { V: 0.20, S: 0.55, I: 0.15, R: 0.00, P: 0.05, A: 0.03, E: 0.02 },
  S: { V: 0.10, S: 0.55, I: 0.15, R: 0.10, P: 0.05, A: 0.03, E: 0.02 },
  I: { V: 0.30, S: 0.25, I: 0.20, R: 0.10, P: 0.05, A: 0.07, E: 0.03 },
  R: { V: 0.05, S: 0.60, I: 0.15, R: 0.15, P: 0.02, A: 0.02, E: 0.01 },
  P: { V: 0.20, S: 0.35, I: 0.10, R: 0.05, P: 0.15, A: 0.10, E: 0.05 },
  A: { V: 0.50, S: 0.20, I: 0.05, R: 0.00, P: 0.05, A: 0.15, E: 0.05 },
  E: { V: 0.00, S: 0.00, I: 0.00, R: 0.00, P: 0.00, A: 0.00, E: 1.00 },
}

// ---------------------------------------------------------------------------
// Raw event -> behavioural state conversion
// ---------------------------------------------------------------------------
// The raw event vocabulary is intentionally small and app-agnostic. Anything
// the platform cannot observe (e.g. tapping a Like button inside a third
// party app) is either unavailable or requires app-level instrumentation.
// ---------------------------------------------------------------------------
export const RAW_EVENT_TO_STATE = {
  OPEN: 'V',
  VIEW: 'V',
  SCROLL: 'S',
  LIKE: 'I',
  COMMENT: 'I',
  SHARE: 'I',
  SAVE: 'I',
  REPEAT_INTERACTION: 'R',
  PAUSE: 'P',
  APP_SWITCH: 'A',
  EXIT: 'E',
}

export function eventToState(eventType) {
  return RAW_EVENT_TO_STATE[eventType] ?? null
}

// ---------------------------------------------------------------------------
// Repetitive-interaction rule
// ---------------------------------------------------------------------------
// R is inferred, not observed. We apply a documented, configurable rule: if at
// least `threshold` INTERACTION events occur with only SCROLL/VIEW events in
// between, the run is marked as REPETITIVE. Otherwise R is never emitted.
// ---------------------------------------------------------------------------
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
        // Mark the trailing I(s) in this run as R (keep the first as I).
        let marked = 0
        for (let k = i + 1; k < j; k++) {
          if (out[k] === 'I') {
            out[k] = 'R'
            marked++
          }
        }
        // If we couldn't mark enough (e.g. run had only Is), fall back to
        // upgrading the last one.
        if (marked === 0 && out[i] === 'I') out[j - 1] = 'R'
      }
      i = j
    } else {
      i++
    }
  }
  return out
}

// ---------------------------------------------------------------------------
// Transition counting + probability estimation
// ---------------------------------------------------------------------------
export function emptyCounts() {
  const m = {}
  for (const s of STATES) {
    m[s] = {}
    for (const t of STATES) m[s][t] = 0
  }
  return m
}

export function countTransitions(states) {
  const counts = emptyCounts()
  for (let i = 0; i < states.length - 1; i++) {
    const a = states[i]
    const b = states[i + 1]
    if (STATES.includes(a) && STATES.includes(b)) counts[a][b] += 1
  }
  return counts
}

export function rowTotals(counts) {
  const totals = {}
  for (const s of STATES) {
    totals[s] = STATES.reduce((acc, t) => acc + (counts[s][t] || 0), 0)
  }
  return totals
}

// Returns { probabilities, totals, insufficient }. `insufficient` marks rows
// with too few outgoing observations to estimate anything meaningful.
export function computeProbabilities(counts, minObservations = 5) {
  const totals = rowTotals(counts)
  const probabilities = {}
  const insufficient = {}
  for (const s of STATES) {
    probabilities[s] = {}
    insufficient[s] = totals[s] < minObservations
    if (totals[s] === 0) {
      for (const t of STATES) probabilities[s][t] = null
      continue
    }
    for (const t of STATES) {
      probabilities[s][t] = counts[s][t] / totals[s]
    }
  }
  // Absorbing EXIT: modelling convention, not an observed transition.
  if (!insufficient['E']) {
    // If we do have E->E observations, keep them; otherwise normalise.
  }
  return { probabilities, totals, insufficient }
}

// ---------------------------------------------------------------------------
// Pattern heuristics (presentation only — NOT a detector)
// ---------------------------------------------------------------------------
// These are deliberately conservative and informational. They are not trained
// or validated and must not be presented as a doomscrolling detector.
// ---------------------------------------------------------------------------
export function analyseSequence(states, opts = {}) {
  const minRepeat = opts.minRepeat ?? 3
  const longSessionEvents = opts.longSessionEvents ?? 25

  let maxScrollRun = 0
  let scrollRun = 0
  let alternations = 0
  for (let i = 0; i < states.length; i++) {
    if (states[i] === 'S') {
      scrollRun++
      maxScrollRun = Math.max(maxScrollRun, scrollRun)
    } else {
      scrollRun = 0
    }
    if (i >= 2 && states[i] === 'I' && states[i - 2] === 'S' && states[i - 1] === 'S') {
      // rough proxy for S→S→I repetition
    }
    if (i >= 3 && states[i] === 'I' && states[i - 2] === 'I' && states[i - 1] === 'S') {
      alternations++
    }
  }

  const counts = countTransitions(states)
  const ss = counts['S']['S']
  const si = counts['S']['I']
  const is_ = counts['I']['S']
  const pauses = counts['P'] ? STATES.reduce((a, t) => a + counts['P'][t], 0) : 0
  const switches = counts['A'] ? STATES.reduce((a, t) => a + counts['A'][t], 0) : 0

  const notes = []
  if (maxScrollRun >= minRepeat) {
    notes.push(`Detected ${maxScrollRun} consecutive SCROLL events. Consecutive scrolling is a behavioural signal, not proof of doomscrolling.`)
  }
  if (alternations >= 2) {
    notes.push(`Detected ${alternations} S→I→S alternations. Repeated interaction between scrolls may indicate a repetitive pattern.`)
  }
  if (ss >= minRepeat && si + is_ >= minRepeat) {
    notes.push('High S→S volume with frequent S↔I alternation — candidate for further inspection.')
  }
  if (pauses === 0 && switches === 0 && states.length >= longSessionEvents) {
    notes.push('Long session with no pauses or app switches detected — additional context worth reviewing.')
  }
  if (notes.length === 0) {
    notes.push('No dominant repetitive pattern detected in this session. This is not a diagnosis of any kind.')
  }
  notes.push('A long session alone does not prove doomscrolling. Repetitive behaviour alone does not prove doomscrolling either.')

  // Label only. Never "Confirmed".
  let label = 'Varied Activity'
  if (states.length < 5) label = 'Insufficient Data'
  else if (ss >= minRepeat && alternations >= 2) label = 'Potential Doomscrolling Pattern'
  else if (ss >= minRepeat || alternations >= 2) label = 'Repetitive Pattern'

  return {
    label,
    maxScrollRun,
    alternations,
    counts,
    notes,
  }
}

// Convenience: build a sequence from raw events, applying the R rule.
export function buildSequenceFromEvents(events, repetitiveThreshold = 3) {
  const raw = events
    .map((e) => eventToState(e.type))
    .filter(Boolean)
  return applyRepetitiveRule(raw, repetitiveThreshold)
}

// Colour ramp for heatmap cells (0 → 1)
export function probabilityToColor(p) {
  if (p === null || p === undefined) return 'rgb(243, 244, 246)' // grey-100
  const clamped = Math.max(0, Math.min(1, p))
  // navy-50 → navy-500
  const stops = [
    [244, 246, 251],
    [230, 234, 245],
    [205, 211, 234],
    [168, 178, 216],
    [107, 116, 184],
    [59, 59, 143],
  ]
  const scaled = clamped * (stops.length - 1)
  const lo = Math.floor(scaled)
  const hi = Math.min(stops.length - 1, lo + 1)
  const t = scaled - lo
  const c = stops[lo].map((v, i) => Math.round(v + (stops[hi][i] - v) * t))
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`
}

export function textColorForProbability(p) {
  if (p === null || p === undefined) return '#6b7280'
  return p > 0.45 ? '#ffffff' : '#111133'
}