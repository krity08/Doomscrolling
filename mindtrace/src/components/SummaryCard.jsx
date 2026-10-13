export default function SummaryCard({ icon: Icon, label, value, sub, accent = 'navy' }) {
  const accents = {
    navy: 'bg-navy-50 text-navy-700',
    amber: 'bg-amber-50 text-amber-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    rose: 'bg-rose-50 text-rose-700',
    violet: 'bg-violet-50 text-violet-700',
  }
  return (
    <div className="bg-white rounded-2xl border border-navy-100 shadow-soft p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-navy-400 uppercase tracking-wide">{label}</div>
          <div className="mt-2 text-2xl font-semibold text-navy-900">{value}</div>
          {sub && <div className="mt-1 text-xs text-navy-400">{sub}</div>}
        </div>
        {Icon && (
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accents[accent]}`}>
            <Icon size={16} />
          </div>
        )}
      </div>
    </div>
  )
}
