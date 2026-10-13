import DemoRecorder from '../components/DemoRecorder.jsx'
import ResearchLimitations from '../components/ResearchLimitations.jsx'

export default function RecorderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy-900">Demo recorder</h1>
        <p className="text-xs text-navy-400 mt-0.5">
          Simulates the activity-recording system. This is a frontend prototype; it does not observe
          any real device or third-party app.
        </p>
      </div>
      <DemoRecorder />
      <ResearchLimitations />
    </div>
  )
}