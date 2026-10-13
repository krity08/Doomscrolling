import { useMemo, useState } from 'react'
import { STATES, STATE_LABELS, ILLUSTRATIVE_MATRIX } from '../utils/markov.js'

// Fixed layout positions inside a 480x340 viewBox.
const POSITIONS = {
  V: { x: 100, y: 70 },
  S: { x: 300, y: 70 },
  I: { x: 440, y: 170 },
  R: { x: 300, y: 270 },
  P: { x: 100, y: 270 },
  A: { x: 240, y: 180 },
  E: { x: 380, y: 300 },
}

export default function MarkovModelDiagram() {
  const [selected, setSelected] = useState('S')
  const matrix = ILLUSTRATIVE_MATRIX

  const outgoing = useMemo(() => {
    return STATES.map((to) => ({ to, p: matrix[selected][to] }))
      .filter((t) => t.p > 0 && t.to !== selected)
      .sort((a, b) => b.p - a.p)
  }, [selected, matrix])

  // Build visible edges: from the selected node and the top edges overall.
  const edges = useMemo(() => {
    const list = []
    for (const from of STATES) {
      for (const to of STATES) {
        const p = matrix[from][to]
        if (p > 0 && from !== to) list.push({ from, to, p })
      }
    }
    // Keep it readable: only show edges >= 0.10, plus anything from the selected node.
    return list.filter((e) => e.p >= 0.1 || e.from === selected)
  }, [matrix, selected])

  return (
    <div className="bg-white rounded-2xl border border-navy-100 shadow-soft p-5">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold text-navy-900">State transition diagram</h3>
          <p className="text-xs text-navy-400 mt-0.5">
            A Markov model allows different possible transitions between states — it is not a fixed sequence.
            Select a node to inspect its outgoing transitions.
          </p>
        </div>
        <span className="text-[10px] px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
          illustrative probabilities
        </span>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-navy-50/40 rounded-xl border border-navy-100">
          <svg viewBox="0 0 480 340" className="w-full h-80">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#6b74b8" />
              </marker>
              <marker id="arrow-active" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b3b8f" />
              </marker>
            </defs>

            {edges.map((e, i) => {
              const a = POSITIONS[e.from]
              const b = POSITIONS[e.to]
              const isActive = e.from === selected
              // offset curve so reciprocal edges don't overlap
              const mx = (a.x + b.x) / 2 + (a.y === b.y ? 0 : 20)
              const my = (a.y + b.y) / 2 - (a.y === b.y ? 25 : 0)
              return (
                <g key={i}>
                  <path
                    d={`M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`}
                    fill="none"
                    stroke={isActive ? '#3b3b8f' : '#a8b2d8'}
                    strokeWidth={isActive ? 2 : 1.2}
                    markerEnd={isActive ? 'url(#arrow-active)' : 'url(#arrow)'}
                    opacity={isActive ? 1 : 0.55}
                  />
                </g>
              )
            })}

            {STATES.map((s) => {
              const p = POSITIONS[s]
              const isSel = s === selected
              return (
                <g
                  key={s}
                  transform={`translate(${p.x},${p.y})`}
                  onClick={() => setSelected(s)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    r="26"
                    fill={isSel ? '#3b3b8f' : '#ffffff'}
                    stroke={isSel ? '#23235a' : '#cdd3ea'}
                    strokeWidth="1.5"
                  />
                  <text
                    textAnchor="middle"
                    dy="1"
                    fontSize="13"
                    fontWeight="600"
                    fill={isSel ? '#ffffff' : '#23235a'}
                  >
                    {s}
                  </text>
                  <text
                    textAnchor="middle"
                    dy="42"
                    fontSize="9"
                    fill="#6b74b8"
                  >
                    {STATE_LABELS[s]}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        <div className="lg:col-span-2">
          <div className="text-xs font-medium text-navy-400 uppercase tracking-wide mb-2">
            Outgoing from {selected} · {STATE_LABELS[selected]}
          </div>
          <ul className="space-y-2">
            {outgoing.length === 0 && (
              <li className="text-xs text-navy-400 bg-navy-50 border border-navy-100 rounded-lg p-3">
                No outgoing probabilities in the illustrative matrix.
              </li>
            )}
            {outgoing.map((o) => (
              <li
                key={o.to}
                className="flex items-center justify-between text-sm bg-navy-50 border border-navy-100 rounded-lg px-3 py-2"
              >
                <span className="text-navy-700">
                  {selected} → {o.to} <span className="text-navy-400">({STATE_LABELS[o.to]})</span>
                </span>
                <span className="font-semibold text-navy-900">{o.p.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-[11px] text-navy-400 leading-relaxed">
            Values shown are <strong>illustrative probabilities — replace with measured data.</strong>{' '}
            Real probabilities must come from labelled, recorded sessions and cannot be produced by
            this prototype alone.
          </div>
        </div>
      </div>
    </div>
  )
}