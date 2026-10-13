import { useState } from 'react'
import { EXAMPLE_STATE_SEQUENCE } from '../data/sampleData.js'
import { STATE_DESCRIPTIONS, STATE_LABELS } from '../utils/markov.js'

export default function StateSequence({ title = 'Example activity sequence', sequence = EXAMPLE_STATE_SEQUENCE, compact = false }) {
  const [active, setActive] = useState(null)
  const transitions = sequence.slice(0, -1).map((s, i) => ({ from: s, to: sequence[i + 1] }))

  return (
    <div className="bg-white rounded-2xl border border-navy-100 shadow-soft p-5">
      <h3 className="text-sm font-semibold text-navy-900">{title}</h3>
      <p className="text-xs text-navy-400 mt-0.5 mb-3">Click any state card to see its meaning.</p>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {sequence.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <button onClick={() => setActive(i)}
              className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${active === i ? 'bg-navy-500 text-white border-navy-500' : 'bg-white text-navy-700 border-navy-100 hover:bg-navy-50'}`}>
              <span className="font-semibold">{s}</span>
              <span className="ml-1 text-[10px] opacity-80">{STATE_LABELS[s]}</span>
            </button>
            {i < sequence.length - 1 && <span className="text-navy-300">→</span>}
          </div>
        ))}
      </div>
      {active !== null && (
        <div className="bg-navy-50 border border-navy-100 rounded-xl p-3 text-xs text-navy-600 mb-4">
          <span className="font-semibold text-navy-900">{sequence[active]} · {STATE_LABELS[sequence[active]]}:</span>{' '}
          {STATE_DESCRIPTIONS[sequence[active]]}
        </div>
      )}
      {!compact && (
        <div>
          <div className="text-xs font-medium text-navy-400 uppercase tracking-wide mb-2">Transition-by-transition analysis</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {transitions.map((t, i) => (
              <div key={i} className="text-xs bg-white border border-navy-100 rounded-lg px-3 py-2 text-navy-600">
                <span className="text-navy-400">#{i + 1}</span>{' '}
                <span className="font-medium text-navy-800">{t.from}</span> →{' '}
                <span className="font-medium text-navy-800">{t.to}</span>
                <div className="text-[11px] text-navy-400">{STATE_LABELS[t.from]} → {STATE_LABELS[t.to]}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
