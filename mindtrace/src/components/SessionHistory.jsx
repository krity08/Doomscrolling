import { useState } from 'react'
import { X, ExternalLink } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'

const LABEL_STYLES = {
  'Varied Activity': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Repetitive Pattern': 'bg-amber-50 text-amber-700 border-amber-100',
  'Potential Doomscrolling Pattern': 'bg-rose-50 text-rose-700 border-rose-100',
  'Insufficient Data': 'bg-gray-100 text-gray-600 border-gray-200',
}

export default function SessionHistory() {
  const { sessions } = useApp()
  const [selected, setSelected] = useState(null)

  return (
    <div className="bg-white rounded-2xl border border-navy-100 shadow-soft">
      <div className="p-5 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-navy-900">Session history</h3>
          <p className="text-xs text-navy-400 mt-0.5">Labelled as <em>Potential</em> — never confirmed.</p>
        </div>
        <span className="text-[10px] px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">sample data</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-navy-400 border-y border-navy-100 bg-navy-50/40">
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">App</th>
              <th className="px-5 py-3 font-medium">Duration</th>
              <th className="px-5 py-3 font-medium">Events</th>
              <th className="px-5 py-3 font-medium">Repeated</th>
              <th className="px-5 py-3 font-medium">Analysis</th>
              <th className="px-5 py-3 font-medium">Potential DS</th>
              <th className="px-5 py-3 font-medium text-right">Details</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id} className="border-b border-navy-100 last:border-b-0 hover:bg-navy-50/50">
                <td className="px-5 py-3 text-navy-700">{s.date}</td>
                <td className="px-5 py-3 text-navy-700">{s.app}</td>
                <td className="px-5 py-3 text-navy-700">{s.durationMinutes} min</td>
                <td className="px-5 py-3 text-navy-700">{s.eventCount}</td>
                <td className="px-5 py-3 text-navy-700">{s.repeatedInteractionCount}</td>
                <td className="px-5 py-3">
                  <span className={`text-[11px] px-2 py-1 rounded-full border ${LABEL_STYLES[s.markovLabel]}`}>
                    {s.markovLabel}
                  </span>
                </td>
                <td className="px-5 py-3 text-navy-700">{s.potentialDoomscrollingMinutes} min</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => setSelected(s)} className="inline-flex items-center gap-1 text-navy-500 hover:text-navy-700 text-xs">
                    View <ExternalLink size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy-900/40" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-sm font-semibold text-navy-900">Session details</h4>
                <p className="text-xs text-navy-400 mt-0.5">{selected.date} · {selected.app} · {selected.durationMinutes} min</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-navy-100">
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-navy-50 rounded-lg p-3">
                <div className="text-[11px] text-navy-400">Events</div>
                <div className="text-lg font-semibold text-navy-900">{selected.eventCount}</div>
              </div>
              <div className="bg-navy-50 rounded-lg p-3">
                <div className="text-[11px] text-navy-400">Repeated</div>
                <div className="text-lg font-semibold text-navy-900">{selected.repeatedInteractionCount}</div>
              </div>
            </div>
            <div className="text-xs text-navy-500 bg-amber-50 border border-amber-100 rounded-lg p-3">
              <strong>Potential Doomscrolling Pattern</strong> is a candidate for review — not a diagnosis.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
