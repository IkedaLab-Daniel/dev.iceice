import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import recordsData from './data/records.json'
import './App.css'
import Hero from './components/Hero'
import Records from './components/Records'
import Statistics from './components/Statistics'
import CalendarPage from './components/CalendarPage'
import Login from './components/Login'
import { Calendar } from 'lucide-react'

function App() {
  const navigate = useNavigate()
  const location = useLocation()

  // Load records from local JSON
  const records = useMemo(() => {
    const validRecords = recordsData.filter(record => record._id && record.day)
    return validRecords.map(record => ({
      ...record,
      _id: record._id.$oid || record._id,
      date: record.date.$date || record.date,
    }))
  }, [])

  return (
    <>
      <Routes>
        <Route path="/" element={
          <div className="page">
            <Hero />
            <Statistics records={records} />
            <Records />
          </div>
        } />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      
      {/* Floating Action Button for Calendar Navigation */}
      {location.pathname === '/' && (
        <button 
          className="fab-calendar" 
          onClick={() => navigate('/calendar')}
          title="View Calendar"
        >
          <Calendar size={24} />
        </button>
      )}
    </>
  )
}

export default App
