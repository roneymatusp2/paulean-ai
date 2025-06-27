import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'
import ToolPage from './components/ToolPage'
import AnalyticsPage from './components/AnalyticsPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tool/:toolId" element={<ToolPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App