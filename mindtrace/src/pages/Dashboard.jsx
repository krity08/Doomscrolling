import { Clock, Smartphone, Hand, Flame, ListChecks } from 'lucide-react'
import SummaryCard from '../components/SummaryCard.jsx'
import UsageChart from '../components/UsageChart.jsx'
import BehavioralActivityChart from '../components/BehavioralActivityChart.jsx'
import ActivityTimeline from '../components/ActivityTimeline.jsx'
import SessionHistory from '../components/SessionHistory.jsx'
import PatternAnalysis from '../components/PatternAnalysis.jsx'
import ResearchLimitations from '../components/ResearchLimitations.jsx'
import { SAMPLE_SUMMARY } from '../data/sampleData.js'

function fmt(min) {
  const h = Math.floor(min / 60), m = min % 60
  if (h === 0) return `${m}m`
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy-900">Dashboard</h1>
        <p className="text-xs text-navy-400 mt-0.5">A snapshot of synthetic behavioural data.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <SummaryCard icon={Clock} label="Total screen time" value={fmt(SAMPLE_SUMMARY.totalScreenTimeMinutes)} sub="all apps, sample" accent="navy" />
        <SummaryCard icon={Smartphone} label="Content app activity" value={fmt(SAMPLE_SUMMARY.contentAppActivityMinutes)} sub="recorded activity, sample" accent="violet" />
        <SummaryCard icon={Hand} label="Recorded interactions" value={SAMPLE_SUMMARY.recordedInteractions} sub="likes, saves, shares" accent="emerald" />
        <SummaryCard icon={Flame} label="Potential doomscrolling" value={`${SAMPLE_SUMMARY.potentialDoomscrollingMinutes} min`} sub="candidate duration" accent="rose" />
        <SummaryCard icon={ListChecks} label="Potential episodes" value={SAMPLE_SUMMARY.potentialEpisodes} sub="flagged for review" accent="amber" />
      </div>
      <div className="grid lg:grid-cols-2 gap-5"><UsageChart /><BehavioralActivityChart /></div>
      <div className="grid lg:grid-cols-2 gap-5"><ActivityTimeline /><PatternAnalysis /></div>
      <SessionHistory />
      <ResearchLimitations />
    </div>
  )
}
