import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Sessions from './pages/Sessions.jsx'
import MarkovPage from './pages/MarkovPage.jsx'
import RecorderPage from './pages/RecorderPage.jsx'
import PrivacyPage from './pages/PrivacyPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'

export default function App() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  return (
    <div className="min-h-screen flex bg-[#f7f8fc]">
      <Sidebar mobileOpen={mobileNavOpen} setMobileOpen={setMobileNavOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenu={() => setMobileNavOpen(true)} />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-[1400px] w-full mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/markov" element={<MarkovPage />} />
            <Route path="/recorder" element={<RecorderPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="px-4 sm:px-6 lg:px-8 py-4 text-xs text-navy-400 border-t border-navy-100">
          MindTrace · Research prototype · Behavioural data shown is synthetic.
        </footer>
      </div>
    </div>
  )
}
