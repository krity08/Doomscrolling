import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { SAMPLE_SESSIONS } from '../data/sampleData.js'

const AppContext = createContext(null)

const DEFAULT_SETTINGS = {
  monitoringEnabled: true,
  demoMode: true,
  pauseThresholdSeconds: 45,
  repetitiveInteractionThreshold: 3,
  showSeconds: false,
  minObservationsForProbabilities: 5,
}

const STORAGE_KEY = 'mindtrace.settings.v1'

export function AppProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS
    } catch {
      return DEFAULT_SETTINGS
    }
  })

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)) } catch {}
  }, [settings])

  const value = useMemo(
    () => ({
      settings,
      updateSetting: (k, v) => setSettings((s) => ({ ...s, [k]: v })),
      resetSettings: () => setSettings(DEFAULT_SETTINGS),
      clearDemoData: () => { try { localStorage.removeItem(STORAGE_KEY) } catch {} },
      sessions: SAMPLE_SESSIONS,
    }),
    [settings],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}
