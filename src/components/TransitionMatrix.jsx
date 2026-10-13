import { useMemo, useState } from 'react'
import {
  STATES,
  STATE_LABELS,
  ILLUSTRATIVE_MATRIX,
  probabilityToColor,
  textColorForProbability,
} from '../utils/markov.js'

export default function TransitionMatrix({ matrix = ILLUSTRATIVE_MATRIX, showLabel = true, totals, insufficient }) {
  const [sel, setSel] = useState({ from: 'S', to: 'S' })

  const cell = (from, to) => (matrix[from]?.[to] ?? null)

  const explanation = useMemo(() => {
    const p = cell(sel.from, sel.to)
    if (p === null || p === undefined) {
      return `Transition ${sel.from} → ${sel.to} has no illustrative probability. Real probabilities require recorded observations.`
    }
    const label =
      sel.from === 'E'
        ? 'Modelling convention: EXIT is absorbing (P(E→E)=1). This is not an observed behavioural transition.'
        : `${STATE_LABELS[sel.from]} → ${STATE_LABELS[sel.to]} occurs with illustrative probability ${p.toFixed(2)}.`
    return label
  }, [sel, matrix])

  const total = totals ? totals[sel.from] : undefined

  return (
    <div className="bg-white rounded-2xl border border-navy-100 shadow-soft p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-navy-900">Transition matrix</h3>
          <p className="text-xs text-navy-400 mt-0.5">
            Row = current state, Column = next state. Click a cell to inspect it.
          </p>
        </div>
        {showLabel && (
          <span className="text-[10px] px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
            Illustrative probabilities — replace with measured data
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="border-separate border-spacing-1 text-xs">
          <thead>
            <tr>
              <th className="w-16"></th>
              {STATES.map((s) => (
                <th key={s} className="w-14 text-navy-500 font-medium">{s}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STATES.map((from) => (
              <tr key={from}>
                <td className="text-navy-500 font-medium pr-1 text-right">{from}</td>
                {STATES.map((to) => {
                  const p = cell(from, to)
                  const isSel = sel.from === from && sel.to === to
                  const bg = probabilityToColor(p)
                  const fg = textColorForProbability(p)
                  return (
                    <td key={to}>
                      <button
                        onClick={() => setSel({ from, to })}
                        className={`w-14 h-11 rounded-lg text-[11px] font-medium transition-transform hover:scale-[1.03] ${
                          isSel ? 'ring-2 ring-navy-500 ring-offset-1' : ''
                        }`}
                        style={{ background: bg, color: fg }}
                        title={`${from} → ${to}`}
                      >
                        {p === null || p === undefined ? '—' : p.toFixed(2)}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid md:grid-cols-3 gap-3">
        <div className="md:col-span-2 bg-navy-50 border border-navy-100 rounded-xl p-3">
          <div className="text-[11px] text-navy-400 uppercase tracking-wide mb-1">Selected transition</div>
          <div className="text-sm text-navy-900 font-medium">
            {sel.from} → {sel.to} · {STATE_LABELS[sel.from]} → {STATE_LABELS[sel.to]}
          </div>
          <div className="text-xs text-navy-500 mt-1">{explanation}</div>
          <div className="text-xs text-navy-500 mt-1">
            {total !== undefined ? `Total observed transitions from ${sel.from}: ${total}.` : null}
            {insufficient && insufficient[sel.from] ? (
              <span className="ml-1 inline-block text-amber-700">Insufficient data for a reliable estimate.</span>
            ) : null}
          </div>
        </div>
        <div className="text-[11px] text-navy-400 leading-relaxed bg-white border border-navy-100 rounded-xl p-3">
          <div className="font-medium text-navy-500 mb-1">Legend</div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-4 rounded" style={{ background: probabilityToColor(0.05) }} /> low
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-4 rounded" style={{ background: probabilityToColor(0.5) }} /> mid
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 rounded" style={{ background: probabilityToColor(0.95) }} /> high
          </div>
          <div className="mt-2">P(E→E)=1 is a modelling convention, not observed behaviour.</div>
        </div>
      </div>
    </div>
  )
}