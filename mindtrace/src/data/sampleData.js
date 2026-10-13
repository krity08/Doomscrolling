export const SAMPLE_SUMMARY = {
  totalScreenTimeMinutes: 260,
  contentAppActivityMinutes: 130,
  recordedInteractions: 248,
  potentialDoomscrollingMinutes: 35,
  potentialEpisodes: 3,
}

export const APP_USAGE = [
  { app: 'Instagram', totalMinutes: 96, activityMinutes: 62, potentialDoomscrollingMinutes: 18, color: '#3b3b8f' },
  { app: 'YouTube',   totalMinutes: 74, activityMinutes: 45, potentialDoomscrollingMinutes: 12, color: '#6b74b8' },
  { app: 'Reddit',    totalMinutes: 52, activityMinutes: 33, potentialDoomscrollingMinutes: 5,  color: '#a8b2d8' },
  { app: 'X (Twitter)', totalMinutes: 38, activityMinutes: 20, potentialDoomscrollingMinutes: 0, color: '#cdd3ea' },
]

export const SAMPLE_SESSION = {
  id: 'sess-demo-1',
  date: '2024-11-12',
  app: 'Instagram',
  startTime: '2024-11-12T20:14:00',
  durationMinutes: 34,
  events: [
    { t: '20:14:02', type: 'OPEN', state: 'V' },
    { t: '20:14:11', type: 'SCROLL', state: 'S' },
    { t: '20:14:19', type: 'SCROLL', state: 'S' },
    { t: '20:14:27', type: 'LIKE', state: 'I' },
    { t: '20:14:35', type: 'SCROLL', state: 'S' },
    { t: '20:14:44', type: 'LIKE', state: 'I' },
    { t: '20:14:52', type: 'SCROLL', state: 'S' },
    { t: '20:15:31', type: 'PAUSE', state: 'P' },
    { t: '20:16:02', type: 'SCROLL', state: 'S' },
    { t: '20:16:20', type: 'SCROLL', state: 'S' },
    { t: '20:16:33', type: 'LIKE', state: 'I' },
    { t: '20:16:41', type: 'SCROLL', state: 'S' },
    { t: '20:17:02', type: 'APP_SWITCH', state: 'A' },
    { t: '20:17:30', type: 'VIEW', state: 'V' },
    { t: '20:18:10', type: 'SCROLL', state: 'S' },
    { t: '20:18:24', type: 'SCROLL', state: 'S' },
    { t: '20:18:39', type: 'LIKE', state: 'I' },
    { t: '20:18:55', type: 'SCROLL', state: 'S' },
    { t: '20:19:12', type: 'EXIT', state: 'E' },
  ],
}

export const SAMPLE_SESSIONS = [
  { id: 'sess-demo-1', date: '2024-11-12', app: 'Instagram', durationMinutes: 34, eventCount: 19, repeatedInteractionCount: 1, markovLabel: 'Repetitive Pattern', potentialDoomscrollingMinutes: 12 },
  { id: 'sess-demo-2', date: '2024-11-12', app: 'YouTube',   durationMinutes: 22, eventCount: 12, repeatedInteractionCount: 0, markovLabel: 'Varied Activity', potentialDoomscrollingMinutes: 0 },
  { id: 'sess-demo-3', date: '2024-11-11', app: 'Reddit',    durationMinutes: 41, eventCount: 27, repeatedInteractionCount: 2, markovLabel: 'Potential Doomscrolling Pattern', potentialDoomscrollingMinutes: 18 },
  { id: 'sess-demo-4', date: '2024-11-11', app: 'X (Twitter)', durationMinutes: 9, eventCount: 4, repeatedInteractionCount: 0, markovLabel: 'Insufficient Data', potentialDoomscrollingMinutes: 0 },
  { id: 'sess-demo-5', date: '2024-11-10', app: 'Instagram', durationMinutes: 28, eventCount: 15, repeatedInteractionCount: 1, markovLabel: 'Repetitive Pattern', potentialDoomscrollingMinutes: 5 },
]

export const BEHAVIOR_OVER_TIME = [
  { window: '0-5m',   Viewing: 1, Scrolling: 6, Interactions: 2, Repetitive: 0, Pauses: 0, Switches: 0 },
  { window: '5-10m',  Viewing: 1, Scrolling: 8, Interactions: 3, Repetitive: 1, Pauses: 0, Switches: 0 },
  { window: '10-15m', Viewing: 0, Scrolling: 7, Interactions: 4, Repetitive: 2, Pauses: 1, Switches: 0 },
  { window: '15-20m', Viewing: 1, Scrolling: 9, Interactions: 3, Repetitive: 1, Pauses: 0, Switches: 1 },
  { window: '20-25m', Viewing: 2, Scrolling: 4, Interactions: 1, Repetitive: 0, Pauses: 1, Switches: 1 },
  { window: '25-30m', Viewing: 1, Scrolling: 5, Interactions: 2, Repetitive: 0, Pauses: 0, Switches: 0 },
  { window: '30-34m', Viewing: 0, Scrolling: 2, Interactions: 0, Repetitive: 0, Pauses: 0, Switches: 0 },
]

export const EXAMPLE_STATE_SEQUENCE = ['V', 'S', 'S', 'I', 'S', 'I', 'S', 'S', 'P', 'S', 'A', 'V']
