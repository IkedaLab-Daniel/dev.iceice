import { useNavigate } from 'react-router-dom'
import recordsData from '../data/records.json'
import CalendarHeatmap from './CalendarHeatmap'
import CalendarView from './CalendarView'
import Header from './Header'
import { ArrowLeft } from 'lucide-react'
import './CalendarPage.css'

const CalendarPage = () => {
  const navigate = useNavigate()
  
  // Load records from local JSON
  const validRecords = recordsData.filter(record => record._id && record.day)
  const records = validRecords.map(record => ({
    ...record,
    _id: record._id.$oid || record._id,
    date: record.date.$date || record.date,
  }))

  return (
    <div className="calendar-page">    
      <div className="calendar-page-container">
        <div className="calendar-page-header">
          <button className="btn-back" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            Back to Home
          </button>
          <h1 className="page-title">Calendar Insights</h1>
        </div>

        <CalendarHeatmap records={records} />
        
        <div className="calendar-view-section">
          <h2 className="section-title">Monthly Calendar</h2>
          <CalendarView records={records} />
        </div>
      </div>
    </div>
  )
}

export default CalendarPage
