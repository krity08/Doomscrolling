import SessionHistory from '../components/SessionHistory.jsx'
import ActivityTimeline from '../components/ActivityTimeline.jsx'
import ResearchLimitations from '../components/ResearchLimitations.jsx'

export default function Sessions() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy-900">Sessions</h1>
        <p className="text-xs text-navy-400 mt-0.5">Past demo sessions and timelines.</p>
      </div>
      <SessionHistory />
      <ActivityTimeline />
      <ResearchLimitations />
    </div>
  )
}
