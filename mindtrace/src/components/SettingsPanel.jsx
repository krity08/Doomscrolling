import { useApp } from '../context/AppContext.jsx'
import { ToggleLeft, ToggleRight, Trash2, Info, RotateCcw } from 'lucide-react'

function Row({ label, hint, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-navy-100 last:border-b-0">
      <div className="min-w-0">
        <div className="text-sm text-navy-800">{label}</div>
        {hint && <div className="text-[11px] text-navy-400 mt-0.5">{hint}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)} className="text-navy-600 hover:text-navy-800" aria-pressed={value}>
      {value ? <ToggleRight size={34} /> : <ToggleLeft size={34} className="text-navy-300" />}
    </button>
  )
}

export default function SettingsPanel() {
  const { settings, updateSetting, clearDemoData, resetSettings } = useApp()
  return (
    <div className="bg-white rounded-2xl border border-navy-100 shadow-soft p-5">
      <h3 className="text-sm font-semibold text-navy-900">Settings</h3>
      <p className="text-xs text-navy-400 mt-0.5 mb-2">Demo controls only. Real device permissions are out of scope.</p>
      <div>
        <Row label="Demo monitoring enabled" hint="When off, the Demo Recorder ignores button presses.">
          <Toggle value={settings.monitoringEnabled} onChange={(v) => updateSetting('monitoringEnabled', v)} />
        </Row>
        <Row label="Demo mode" hint="Keeps the interface on synthetic data.">
          <Toggle value={settings.demoMode} onChange={(v) => updateSetting('demoMode', v)} />
        </Row>
        <Row label="Pause threshold (seconds)" hint="A gap longer than this counts as PAUSE.">
          <input type="number" min={5} max={600} value={settings.pauseThresholdSeconds}
            onChange={(e) => updateSetting('pauseThresholdSeconds', Math.max(5, Number(e.target.value) || 5))}
            className="w-24 px-3 py-1.5 rounded-lg border border-navy-100 text-sm focus:outline-none" />
        </Row>
        <Row label="Repetitive interaction threshold" hint="Interactions required before R state is applied.">
          <input type="number" min={2} max={10} value={settings.repetitiveInteractionThreshold}
            onChange={(e) => updateSetting('repetitiveInteractionThreshold', Math.max(2, Number(e.target.value) || 2))}
            className="w-24 px-3 py-1.5 rounded-lg border border-navy-100 text-sm focus:outline-none" />
        </Row>
        <Row label="Minimum observations for probabilities" hint="Below this, a row is labelled Insufficient Data.">
          <input type="number" min={1} max={50} value={settings.minObservationsForProbabilities}
            onChange={(e) => updateSetting('minObservationsForProbabilities', Math.max(1, Number(e.target.value) || 1))}
            className="w-24 px-3 py-1.5 rounded-lg border border-navy-100 text-sm focus:outline-none" />
        </Row>
        <Row label="Show seconds in durations" hint="Presentation preference.">
          <Toggle value={settings.showSeconds} onChange={(v) => updateSetting('showSeconds', v)} />
        </Row>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <button onClick={clearDemoData} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100">
          <Trash2 size={14} /> Clear demo data
        </button>
        <button onClick={resetSettings} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100">
          <RotateCcw size={14} /> Reset settings
        </button>
      </div>
      <div className="mt-4 flex items-start gap-2 text-xs bg-navy-50 border border-navy-100 text-navy-700 rounded-lg p-3">
        <Info size={14} className="mt-0.5 shrink-0" />
        <div>Changing the pause or repetition thresholds updates the demo rules used by the Demo Recorder.</div>
      </div>
    </div>
  )
}
