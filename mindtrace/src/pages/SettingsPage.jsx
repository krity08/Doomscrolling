import SettingsPanel from '../components/SettingsPanel.jsx'
import PrivacyPanel from '../components/PrivacyPanel.jsx'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy-900">Settings</h1>
        <p className="text-xs text-navy-400 mt-0.5">Demo controls that affect the recorder and probability labelling.</p>
      </div>
      <SettingsPanel />
      <PrivacyPanel />
    </div>
  )
}
