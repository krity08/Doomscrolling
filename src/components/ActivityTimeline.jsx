import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { SAMPLE_SESSION } from '../data/sampleData.js'
import { STATE_LABELS } from '../utils/markov.js'

const STATE_STYLES = {
  V: 'bg-sky-50 text-sky-700 border-sky-100',
  S: 'bg-navy-50 text-navy-700 border-navy-100',
  I: 'bg-violet-50 text-violet-700 border-violet-100',
  R: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100',
  P: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  A: 'bg-amber-50 text-amber-700 border-amber-100',
  E: 'bg-gray-100 text-gray-700 border-gray-200',
}

export default function ActivityTimeline() {
  const [openIdx, setOpenIdx] = useState(null)

  const events = SAMPLE_SESSION.events

  const sequenceString = useMemo(
    () => events.map((e) => STATE_LABELS[e.state] ?? e.state).join(' → '),
    [events],
  )

  return (
    <div className="bg-white rounded-2xl border border-navy-100 shadow-soft p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-navy-900">Activity timeline</h3>
          <p className="text-xs text-navy-400 mt-0.5">
            Behavioural events recorded during a demo session. Tap an event for details.
          </p>
        </div>
        <span className="text-[10px] px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
          sample session
        </span>
      </div>

      <div className="mb-4 text-xs text-navy-500 bg-navy-50 border border-navy-100 rounded-lg px-3 py-2 overflow-x-auto whitespace-nowrap">
        {sequenceString}
      </div>

      <ol className="relative border-l border-navy-100 ml-3 space-y-2 max-h-96 overflow-y-auto pr-2">
        {events.map((e, idx) => (
          <li key={idx} className="ml-4">
            <span className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full bg-white border-2 border-navy-300" />
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full text-left flex items-center justify-between gap-3 py-2 px-3 rounded-lg hover:bg-navy-50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-[11px] text-navy-400 w-16 shrink-0">{e.t}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${STATE_STYLES[e.state]}`}>
                  {STATE_LABELS[e.state]}
                </span>
                <span className="text-xs text-navy-500 truncate">{e.type}</span>
              </div>
              <ChevronDown
                size={14}
                className={`shrink-0 text-navy-300 transition-transform ${openIdx === idx ? 'rotate-180' : ''}`}
              />
            </button>
            {openIdx === idx && (
              <div className="ml-3 mb-2 text-xs text-navy-500 bg-navy-50 rounded-lg p-3">
                Event type <code className="text-navy-700">{e.type}</code> mapped to behavioural state{' '}
                <strong>{STATE_LABELS[e.state]}</strong> at {e.t}. No message contents, media, or
                typed text are recorded.
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}