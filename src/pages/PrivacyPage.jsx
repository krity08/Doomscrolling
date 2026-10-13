import PrivacyPanel from '../components/PrivacyPanel.jsx'
import ResearchLimitations from '../components/ResearchLimitations.jsx'

export default function PrivacyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy-900">Privacy & data</h1>
        <p className="text-xs text-navy-400 mt-0.5">
          Privacy is a first-class requirement for this research project. The prototype collects
          nothing beyond behavioural event types and timestamps.
        </p>
      </div>
      <PrivacyPanel />
      <ResearchLimitations />
    </div>
  )
}