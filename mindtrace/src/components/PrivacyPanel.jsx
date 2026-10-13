import { ShieldCheck, EyeOff, MessageSquareOff, KeyRound, ImageOff, Type, Database, AlertTriangle } from 'lucide-react'

const ITEMS = [
  { icon: MessageSquareOff, title: 'No message contents', body: 'Messages, DMs, and chat content are not collected or displayed anywhere in this prototype.' },
  { icon: KeyRound, title: 'No passwords or usernames', body: 'The app never requests or stores credentials. There is no login in this demo.' },
  { icon: ImageOff, title: 'No photos, videos, or post contents', body: 'Media and post bodies are out of scope and never shown in activity logs.' },
  { icon: Type, title: 'No typed text', body: 'Text you type is never captured. Only behavioural event types and timestamps.' },
  { icon: Database, title: 'Local storage only', body: 'Demo settings persist in localStorage in your own browser.' },
  { icon: EyeOff, title: 'Synthetic sample data', body: 'Dashboard, sessions, and matrix values are fabricated for demonstration.' },
]

export default function PrivacyPanel() {
  return (
    <div className="bg-white rounded-2xl border border-navy-100 shadow-soft p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
          <ShieldCheck size={16} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-navy-900">Privacy & data</h3>
          <p className="text-xs text-navy-400 mt-0.5">Design intent: collect the minimum behavioural events required for analysis.</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {ITEMS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="border border-navy-100 rounded-xl p-3 bg-white">
            <div className="flex items-center gap-2 text-navy-800 text-xs font-semibold">
              <Icon size={14} /> {title}
            </div>
            <p className="text-[11px] text-navy-500 mt-1 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-start gap-2 text-xs bg-amber-50 border border-amber-100 text-amber-800 rounded-lg p-3">
        <AlertTriangle size={14} className="mt-0.5 shrink-0" />
        <div>We do not claim that this prototype is fully privacy-preserving in production. Real device integration and secure storage would need separate implementation.</div>
      </div>
    </div>
  )
}
