import { NavLink } from 'react-router-dom'
import { LayoutDashboard, History, GitBranch, Radio, ShieldCheck, Settings as SettingsIcon, X, Activity } from 'lucide-react'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/sessions', label: 'Sessions', icon: History },
  { to: '/markov', label: 'Markov Model', icon: GitBranch },
  { to: '/recorder', label: 'Demo Recorder', icon: Radio },
  { to: '/privacy', label: 'Privacy & Data', icon: ShieldCheck },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
]

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const inner = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-navy-500 text-white flex items-center justify-center shadow-soft">
          <Activity size={18} />
        </div>
        <div>
          <div className="font-semibold text-navy-900 leading-tight">MindTrace</div>
          <div className="text-[11px] text-navy-400 leading-tight">Behavioural Analytics</div>
        </div>
      </div>
      <nav className="px-3 mt-2 flex-1 space-y-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            onClick={() => setMobileOpen?.(false)}
            className={({ isActive }) =>
              ['flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
               isActive ? 'bg-navy-500 text-white shadow-soft' : 'text-navy-700 hover:bg-navy-100'].join(' ')}>
            <Icon size={16} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-4 text-[11px] text-navy-400 border-t border-navy-100">
        Research prototype · v1.0
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-navy-100 bg-white">{inner}</aside>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-navy-900/30" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl">
            <button onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 p-2 rounded-lg hover:bg-navy-100" aria-label="Close">
              <X size={18} />
            </button>
            {inner}
          </div>
        </div>
      )}
    </>
  )
}
