import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { BEHAVIOR_OVER_TIME } from '../data/sampleData.js'

const SERIES = [
  { key: 'Viewing', color: '#a8b2d8' },
  { key: 'Scrolling', color: '#3b3b8f' },
  { key: 'Interactions', color: '#6b74b8' },
  { key: 'Repetitive', color: '#8b5cf6' },
  { key: 'Pauses', color: '#10b981' },
  { key: 'Switches', color: '#f59e0b' },
]

export default function BehavioralActivityChart() {
  return (
    <div className="bg-white rounded-2xl border border-navy-100 shadow-soft p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-navy-900">Behavioural activity over time</h3>
          <p className="text-xs text-navy-400 mt-0.5">Phone activity consists of different behaviours — not just scrolling.</p>
        </div>
        <span className="text-[10px] px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">sample data</span>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={BEHAVIOR_OVER_TIME} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <defs>
              {SERIES.map((s) => (
                <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.color} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={s.color} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} stroke="#eef0f7" />
            <XAxis dataKey="window" tick={{ fontSize: 12, fill: '#6b74b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#6b74b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e6eaf5', fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {SERIES.map((s) => (
              <Area key={s.key} type="monotone" dataKey={s.key} stroke={s.color} fill={`url(#grad-${s.key})`} strokeWidth={2} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
