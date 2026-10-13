import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Play, Square, RotateCcw, Clock, Activity, Eye, MousePointerClick,
  Heart, Pause as PauseIcon, Repeat, Shuffle, Info,
} from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import {
  STATE_LABELS,
  countTransitions,
  computeProbabilities,
  analyseSequence,
  applyRepetitiveRule,
} from '../utils/markov.js'
import TransitionMatrix from './TransitionMatrix.jsx'

// ---------------------------------------------------------------------------
// Raw event vocabulary — what a real Android event collector would emit.
// The user NEVER picks these directly in this demo; the session simulator
// generates them, and the classifier maps them to behavioural states.
// ---------------------------------------------------------------------------
const RAW_TYPES = ['VIEW', 'SCROLL', 'LIKE', 'PAUSE', 'APP_SWITCH']

const STATE_BADGE = {
  V: 'bg-sky-50 text-sky-700 border-sky-100',
  S: 'bg-navy-50 text-navy-700 border-navy-100',
  I: 'bg-violet-50 text-violet-700 border-violet-100',
  R: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100',
  P: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  A: 'bg-amber-50 text-amber-700 border-amber-100',
  E: 'bg-gray-100 text-gray-700 border-gray-200',
}

const ICONS = {
  V: Eye, S: MousePointerClick, I: Heart, R: Repeat,
  P: PauseIcon, A: Shuffle, E: Square,
}

// The "weights" below define the demo's synthetic behaviour generator.
// They are NOT measurements — they simply produce a plausible-looking
// stream so the classifier has something to work on.
const NEXT_BIAS = {
  V: ['S', 'S', 'S', 'I', 'P'],
  S: ['S', 'S', 'S', 'I', 'I', 'V', 'P'],
  I: ['S', 'S', 'V', 'I', 'P', 'A'],
  P: ['S', 'V', 'A'],
  A: ['V', 'S', 'E'],
}

function pickNext(prev) {
  const pool = NEXT_BIAS[prev] ?? ['S', 'V', 'I']
  return pool[Math.floor(Math.random() * pool.length)]
}

export default function DemoRecorder() {
  const { settings } = useApp()

  // Session state
  const [running, setRunning] = useState(false)
  const [startedAt, setStartedAt] = useState(null)
  const [endedAt, setEndedAt] = useState(null)
  const [events, setEvents] = useState([])        // raw events with timestamps
  const [tick, setTick] = useState(0)             // forces re-render every second

  const tickRef = useRef(null)

  // --- 1) Start session -----------------------------------------------------
  function startSession() {
    setRunning(true)
    setStartedAt(Date.now())
    setEndedAt(null)
    setEvents([])
  }

  // --- 2) End session -------------------------------------------------------
  function endSession() {
    setRunning(false)
    setEndedAt(Date.now())
    // Emit EXIT as a raw event so the sequence closes cleanly.
    setEvents((prev) => [
      ...prev,
      { t: new Date().toISOString(), type: 'EXIT', source: 'session-end' },
    ])
  }

  // --- 3) Reset -------------------------------------------------------------
  function reset() {
    setRunning(false)
    setStartedAt(null)
    setEndedAt(null)
    setEvents([])
  }

  // --- 4) Auto event generation while running -------------------------------
  // Every 1.2–2.5 seconds we append one synthetic raw event. This is the
  // "activity stream" that a real Android recorder would provide.
  useEffect(() => {
    if (!running) return
    if (!settings.monitoringEnabled) return

    const id = setInterval(() => {
      setEvents((prev) => {
        const last = prev.length ? prev[prev.length - 1]._state : 'V'
        const nextState = pickNext(last)
        // convert state -> a plausible raw event type
        let rawType = 'VIEW'
        if (nextState === 'S') rawType = 'SCROLL'
        else if (nextState === 'I') rawType = 'LIKE'
        else if (nextState === 'P') rawType = 'PAUSE'
        else if (nextState === 'A') rawType = 'APP_SWITCH'
        else rawType = 'VIEW'

        const t = new Date().toISOString()
        return [...prev, { t, type: rawType, _state: nextState, source: 'simulator' }]
      })
    }, 1400 + Math.random() * 800)

    return () => clearInterval(id)
  }, [running, settings.monitoringEnabled])

  // --- 5) Re-render every second so the "elapsed" timer ticks ----------------
  useEffect(() => {
    if (!running) return
    tickRef.current = setInterval(() => setTick((x) => x + 1), 1000)
    return () => clearInterval(tickRef.current)
  }, [running])

  // --- 6) Derive states, sequence, matrix -----------------------------------
  const rawStates = useMemo(() => events.map((e) => e._state).filter(Boolean), [events])
  const sequence = useMemo(
    () => applyRepetitiveRule(rawStates, settings.repetitiveInteractionThreshold),
    [rawStates, settings.repetitiveInteractionThreshold],
  )
  const counts = useMemo(() => countTransitions(sequence), [sequence])
  const { probabilities, totals, insufficient } = useMemo(
    () => computeProbabilities(counts, settings.minObservationsForProbabilities),
    [counts, settings.minObservationsForProbabilities],
  )
  const analysis = useMemo(() => analyseSequence(sequence), [sequence])

  const totalTransitions = sequence.length > 1 ? sequence.length - 1 : 0
  const sufficient = totalTransitions >= settings.minObservationsForProbabilities
  const currentState = sequence.length ? sequence[sequence.length - 1] : null

  // Counts of each state for the "auto classification" summary
  const stateCounts = useMemo(() => {
    const c = { V: 0, S: 0, I: 0, R: 0, P: 0, A: 0, E: 0 }
    for (const s of sequence) c[s] = (c[s] || 0) + 1
    return c
  }, [sequence])

  // Elapsed time
  const elapsedSec = useMemo(() => {
    if (!startedAt) return 0
    const end = endedAt ?? Date.now()
    return Math.floor((end - startedAt) / 1000)
  }, [startedAt, endedAt, tick])

  const recent = useMemo(() => events.slice(-12).reverse(), [events])

  return (
    <div className="space-y-5">
      {/* ------- Session controls ------- */}
      <div className="bg-white rounded-2xl border border-navy-100 shadow-soft p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-navy-900">Recorder</h3>
            <p className="text-xs text-navy-400 mt-0.5">
              Start a session. The recorder collects synthetic behavioural events and classifies
              them automatically — you don't pick the states by hand.
            </p>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
            simulated
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {!running ? (
            <button
              onClick={startSession}
              disabled={!settings.monitoringEnabled}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-navy-500 text-white hover:bg-navy-600 disabled:opacity-40"
            >
              <Play size={16} /> Start Session
            </button>
          ) : (
            <button
              onClick={endSession}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-rose-500 text-white hover:bg-rose-600"
            >
              <Square size={16} /> End Session
            </button>
          )}
          <button
            onClick={reset}
            disabled={running || events.length === 0}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 disabled:opacity-40"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>

        {!settings.monitoringEnabled && (
          <div className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg p-3 mb-4">
            Monitoring is disabled in Settings. Enable "Demo monitoring" to record.
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-navy-50 rounded-lg p-3">
            <div className="text-[11px] text-navy-400">Status</div>
            <div className="text-sm font-semibold text-navy-900 flex items-center gap-1.5">
              {running && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
              {running ? 'Recording' : endedAt ? 'Ended' : 'Idle'}
            </div>
          </div>
          <div className="bg-navy-50 rounded-lg p-3">
            <div className="text-[11px] text-navy-400">Elapsed</div>
            <div className="text-sm font-semibold text-navy-900 font-mono">
              {String(Math.floor(elapsedSec / 60)).padStart(2, '0')}:
              {String(elapsedSec % 60).padStart(2, '0')}
            </div>
          </div>
          <div className="bg-navy-50 rounded-lg p-3">
            <div className="text-[11px] text-navy-400">Events recorded</div>
            <div className="text-sm font-semibold text-navy-900">{events.length}</div>
          </div>
          <div className="bg-navy-50 rounded-lg p-3">
            <div className="text-[11px] text-navy-400">Transitions</div>
            <div className="text-sm font-semibold text-navy-900">{totalTransitions}</div>
          </div>
        </div>

        <div className="mt-3 flex items-start gap-2 text-[11px] text-navy-500 bg-navy-50 border border-navy-100 rounded-lg p-3">
          <Info size={13} className="mt-0.5 shrink-0 text-navy-400" />
          <div>
            For this prototype, the recorder generates <strong>synthetic activity</strong> on a timer
            (every ~1.4s) so you can see the classifier in action. A real Android recorder would
            emit the same raw event types (VIEW / SCROLL / LIKE / PAUSE / APP_SWITCH) from the OS.
          </div>
        </div>
      </div>

      {/* ------- Auto classification summary ------- */}
      <div className="bg-white rounded-2xl border border-navy-100 shadow-soft p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-navy-900">Automatic classification</h3>
          <span className="text-[10px] text-navy-400">derived from raw events</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {['V', 'S', 'I', 'R', 'P', 'A'].map((s) => {
            const Icon = ICONS[s]
            return (
              <div key={s} className={`rounded-lg border p-3 ${STATE_BADGE[s]}`}>
                <div className="flex items-center gap-1.5 text-[11px] font-medium">
                  <Icon size={12} /> {STATE_LABELS[s]}
                </div>
                <div className="text-lg font-semibold mt-1">{stateCounts[s] || 0}</div>
                <div className="text-[10px] opacity-70">events</div>
              </div>
            )
          })}
        </div>
        {currentState && (
          <div className="mt-3 text-xs text-navy-500">
            Current state: <span className={`inline-block px-2 py-0.5 rounded-full border font-medium ${STATE_BADGE[currentState]}`}>
              {currentState} · {STATE_LABELS[currentState]}
            </span>
          </div>
        )}
      </div>

      {/* ------- Live log + sequence ------- */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-navy-100 shadow-soft p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-navy-900">Live event log</h3>
            <span className="text-[10px] text-navy-400">newest first</span>
          </div>
          {recent.length === 0 ? (
            <div className="text-xs text-navy-400 bg-navy-50 border border-dashed border-navy-200 rounded-lg p-6 text-center">
              {running ? 'Waiting for events…' : 'Press Start Session to begin recording.'}
            </div>
          ) : (
            <ul className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
              {recent.map((e, i) => {
                const state = e._state
                const time = new Date(e.t).toTimeString().slice(0, 8)
                return (
                  <li key={`${e.t}-${i}`} className="flex items-center gap-3 text-xs bg-white border border-navy-100 rounded-lg px-3 py-2">
                    <Clock size={12} className="text-navy-300" />
                    <span className="text-navy-400 font-mono w-16">{time}</span>
                    <span className="text-navy-700 font-medium">{e.type}</span>
                    <span className="text-[10px] text-navy-300">via {e.source}</span>
                    <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full border font-medium ${STATE_BADGE[state]}`}>
                      {state} · {STATE_LABELS[state]}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-navy-100 shadow-soft p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-navy-900">Derived state sequence</h3>
            <span className="text-[10px] text-navy-400">{sequence.length} states</span>
          </div>
          {sequence.length === 0 ? (
            <div className="text-xs text-navy-400 bg-navy-50 border border-dashed border-navy-200 rounded-lg p-6 text-center">
              The classified sequence will appear here.
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-1.5 max-h-80 overflow-y-auto pr-1">
              {sequence.map((s, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className={`text-[11px] px-2 py-1 rounded-md border font-medium ${STATE_BADGE[s]}`}>
                    {s} <span className="opacity-70 font-normal">{STATE_LABELS[s]}</span>
                  </span>
                  {i < sequence.length - 1 && <span className="text-navy-300">→</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ------- Pattern analysis ------- */}
      <div className="bg-white rounded-2xl border border-navy-100 shadow-soft p-5">
        <h3 className="text-sm font-semibold text-navy-900 mb-3">Pattern analysis (live)</h3>
        <div className="grid md:grid-cols-3 gap-3 mb-4">
          <div className="bg-navy-50 rounded-lg p-3">
            <div className="text-[11px] text-navy-400">Detected pattern</div>
            <div className="text-sm font-semibold text-navy-900">{analysis.label}</div>
          </div>
          <div className="bg-navy-50 rounded-lg p-3">
            <div className="text-[11px] text-navy-400">Max consecutive scroll</div>
            <div className="text-sm font-semibold text-navy-900">{analysis.maxScrollRun}</div>
          </div>
          <div className="bg-navy-50 rounded-lg p-3">
            <div className="text-[11px] text-navy-400">S→I→S alternations</div>
            <div className="text-sm font-semibold text-navy-900">{analysis.alternations}</div>
          </div>
        </div>
        <ul className="space-y-1.5">
          {analysis.notes.map((n, i) => (
            <li key={i} className="text-[11px] text-navy-500 bg-white border border-navy-100 rounded-lg p-2">
              • {n}
            </li>
          ))}
        </ul>
      </div>

      {/* ------- Demo transition matrix ------- */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-medium text-navy-400 uppercase tracking-wide">
            Demo transition matrix (from this session)
          </div>
          {!sufficient && (
            <span className="text-[10px] px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
              Insufficient data for reliable probabilities
            </span>
          )}
        </div>
        {sufficient ? (
          <TransitionMatrix matrix={probabilities} showLabel={false} totals={totals} insufficient={insufficient} />
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-navy-200 p-6 text-center">
            <div className="text-sm font-semibold text-navy-700">Insufficient Data</div>
            <p className="text-xs text-navy-400 mt-1 max-w-md mx-auto">
              A short session cannot produce reliable transition probabilities. Let the recorder
              run a bit longer (or lower the threshold in Settings) before trusting this matrix.
            </p>
            <div className="mt-3 text-xs text-navy-500">
              Currently: <strong>{totalTransitions}</strong> transition{totalTransitions === 1 ? '' : 's'} observed.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
