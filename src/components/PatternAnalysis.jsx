import { EXAMPLE_STATE_SEQUENCE } from '../data/sampleData.js'
import { analyseSequence } from '../utils/markov.js'
import { AlertTriangle, Info, Sparkles } from 'lucide-react'

const LABEL_STYLES = {
  'Varied Activity': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Repetitive Pattern': 'bg-amber-50 text-amber-700 border-amber-100',
  'Potential Doomscrolling Pattern': 'bg-rose-50 text-rose-700 border-rose-100',
  'Insufficient Data': 'bg-gray-100 text-gray-600 border-gray-200',
}

export default function PatternAnalysis({ sequence = EXAMPLE_STATE_SEQUENCE }) {
  const result = analyseSequence(sequence)
  return (
    <div className="bg-white rounded-2xl border border-navy-100 shadow-soft p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-navy-900">Behavioural pattern analysis</h3>
          <p className="text-xs text-navy-400 mt-0.5">
            The model examines transitions and repeated patterns. It does not diagnose the user.
          </p>
        </div>
        <span className={`text-[11px] px-2 py-1 rounded-full border ${LABEL_STYLES[result.label]}`}>
          {result.label}
        </span>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-navy-50 rounded-lg p-3">
          <div className="text-[11px] text-navy-400">Max consecutive SCROLL</div>
          <div className="text-lg font-semibold text-navy-900">{result.maxScrollRun}</div>
        </div>
        <div className="bg-navy-50 rounded-lg p-3">
          <div className="text-[11px] text-navy-400">S→I→S alternations</div>
          <div className="text-lg font-semibold text-navy-900">{result.alternations}</div>
        </div>
        <div className="bg-navy-50 rounded-lg p-3">
          <div className="text-[11px] text-navy-400">S→S transitions</div>
          <div className="text-lg font-semibold text-navy-900">{result.counts['S']['S']}</div>
        </div>
      </div>

      <ul className="space-y-2">
        {result.notes.map((n, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-navy-600 bg-white border border-navy-100 rounded-lg p-3">
            <Info size={14} className="mt-0.5 text-navy-400 shrink-0" />
            <span>{n}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-start gap-2 text-xs bg-amber-50 border border-amber-100 text-amber-800 rounded-lg p-3">
        <AlertTriangle size={14} className="mt-0.5 shrink-0" />
        <div>
          Labels are <strong>candidates for review</strong>, not diagnoses. No user intention or
          emotional state is established. A long session alone does not prove doomscrolling, and
          repetitive behaviour alone does not prove doomscrolling either.
        </div>
      </div>

      <div className="mt-3 flex items-start gap-2 text-xs bg-navy-50 border border-navy-100 text-navy-700 rounded-lg p-3">
        <Sparkles size={14} className="mt-0.5 shrink-0" />
        <div>
          Real probabilities require labelled session data and validation against an appropriate
          reference. See the Markov section for how probabilities are computed.
        </div>
      </div>
    </div>
  )
}