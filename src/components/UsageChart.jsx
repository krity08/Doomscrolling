import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts'
import { APP_USAGE } from '../data/sampleData.js'

export default function UsageChart() {
  return (
    <div className="bg-white rounded-2xl border border-navy-100 shadow-soft p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-navy-900">App usage breakdown</h3>
          <p className="text-xs text-navy-400 mt-0.5">
            Total session duration vs. recorded activity vs. potential doomscrolling.
          </p>
        </div>
        <span className="text-[10px] px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
          sample data
        </span>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={APP_USAGE} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#eef0f7" />
            <XAxis dataKey="app" tick={{ fontSize: 12, fill: '#6b74b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#6b74b8' }} axisLine={false} tickLine={false} unit="m" />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: '1px solid #e6eaf5', fontSize: 12 }}
              formatter={(v, n) => [`${v} min`, n]}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="totalMinutes" name="Total session" fill="#cdd3ea" radius={[6, 6, 0, 0]} />
            <Bar dataKey="activityMinutes" name="Recorded activity" fill="#6b74b8" radius={[6, 6, 0, 0]} />
            <Bar dataKey="potentialDoomscrollingMinutes" name="Potential doomscrolling" fill="#3b3b8f" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 text-[11px] text-navy-400">
        Note: not every minute spent in a content app is doomscrolling. Session time,
        recorded activity time, and potential-doomscrolling time are distinct measures.
      </div>
    </div>
  )
}