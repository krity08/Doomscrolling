import MarkovModelDiagram from '../components/MarkovModelDiagram.jsx'
import TransitionMatrix from '../components/TransitionMatrix.jsx'
import StateSequence from '../components/StateSequence.jsx'
import PatternAnalysis from '../components/PatternAnalysis.jsx'
import ResearchLimitations from '../components/ResearchLimitations.jsx'
import { STATE_DESCRIPTIONS, STATE_LABELS, STATES } from '../utils/markov.js'

export default function MarkovPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy-900">Markov model</h1>
        <p className="text-xs text-navy-400 mt-0.5">
          The core analytical component of this project. A Markov model represents the probability
          of moving between behavioural states. It is not a fixed sequence.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-navy-100 shadow-soft p-5">
        <h2 className="text-sm font-semibold text-navy-900 mb-2">States</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STATES.map((s) => (
            <div key={s} className="border border-navy-100 rounded-xl p-3 bg-white">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-navy-500 text-white flex items-center justify-center text-xs font-semibold">
                  {s}
                </span>
                <span className="text-xs font-semibold text-navy-800">{STATE_LABELS[s]}</span>
              </div>
              <p className="text-[11px] text-navy-500 mt-2 leading-relaxed">{STATE_DESCRIPTIONS[s]}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 text-[11px] text-navy-400">
          R (REPETITIVE INTERACTION) is an <strong>analytical state</strong> inferred from a sequence
          of events using a configurable rule, not necessarily a single raw event.
        </div>
      </div>

      <MarkovModelDiagram />

      <TransitionMatrix />

      <div className="bg-white rounded-2xl border border-navy-100 shadow-soft p-5">
        <h2 className="text-sm font-semibold text-navy-900 mb-2">How transition probabilities are calculated</h2>
        <p className="text-xs text-navy-600 mb-2">
          P(i → j) = number of observed transitions from state i to state j divided by the total
          number of observed transitions starting from state i.
        </p>
        <div className="bg-navy-50 border border-navy-100 rounded-xl p-3 text-xs text-navy-700">
          Example: if 60 out of 100 transitions starting from SCROLL lead to SCROLL, then
          <code className="mx-1 px-1.5 py-0.5 rounded bg-white border border-navy-100">P(S → S) = 60 / 100 = 0.60</code>.
        </div>
        <p className="text-xs text-navy-500 mt-3">
          Real probabilities must be calculated from recorded and appropriately labelled session data.
          The matrix must not be presented as a scientifically validated doomscrolling detector by
          itself.
        </p>
      </div>

      <StateSequence />

      <PatternAnalysis />

      <ResearchLimitations />
    </div>
  )
}