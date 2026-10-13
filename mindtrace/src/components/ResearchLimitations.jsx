import { AlertTriangle } from 'lucide-react'

const LIMITS = [
  'Scrolling does not automatically mean doomscrolling.',
  'A Markov model represents transitions. It does not establish a user\'s intention or emotional state.',
  'A valid detector requires labelled data and evaluation against an appropriate reference.',
  'A frontend simulation cannot monitor real phone activity.',
  'Actual Android event collection requires separate implementation and permissions.',
  'Some app-specific actions may not be reliably observable through standard Android APIs.',
  'The model\'s accuracy must be evaluated before making claims about real-world detection.',
]

export default function ResearchLimitations() {
  return (
    <div className="bg-white rounded-2xl border border-navy-100 shadow-soft p-5">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={16} className="text-amber-600" />
        <h3 className="text-sm font-semibold text-navy-900">Research limitations</h3>
      </div>
      <ol className="space-y-2 text-xs text-navy-600 list-decimal pl-5">
        {LIMITS.map((l, i) => (<li key={i} className="leading-relaxed">{l}</li>))}
      </ol>
    </div>
  )
}
