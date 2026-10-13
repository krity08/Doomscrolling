import { Menu, ShieldCheck, FlaskConical } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'

export default function Topbar({ onMenu }) {
  const { settings } = useApp()
  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-navy-100">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button className="lg:hidden p-2 rounded-lg hover:bg-navy-100" onClick={onMenu} aria-label="Menu">
            <Menu size={18} />
          </button>
          <div>
            <div className="text-sm font-semibold text-navy-900 leading-tight">
              Understand your digital habits. Recognize behavioural patterns.
            </div>
            <div className="text-[11px] text-navy-400">Demonstration interface · synthetic data</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
            <FlaskConical size={12} /> Sample data
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
            <ShieldCheck size={12} /> Local-only prototype
          </span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${settings.monitoringEnabled ? 'bg-navy-50 text-navy-700 border-navy-100' : 'bg-gray-50 text-gray-600 border-gray-100'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${settings.monitoringEnabled ? 'bg-emerald-500' : 'bg-gray-400'}`} />
            {settings.monitoringEnabled ? 'Demo monitoring on' : 'Paused'}
          </span>
        </div>
      </div>
    </header>
  )
}
