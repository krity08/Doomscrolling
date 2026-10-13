import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

function Home() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold text-navy-900">MindTrace</h1>
      <p className="text-navy-500 mt-2">Understand your digital habits. Recognize behavioural patterns.</p>
      <div className="mt-6 p-5 bg-white rounded-2xl shadow-soft border border-navy-100">
        <p className="text-sm text-navy-700">✅ App is rendering successfully.</p>
        <p className="text-xs text-navy-400 mt-1">Replace this page with the full Dashboard when you're ready.</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}