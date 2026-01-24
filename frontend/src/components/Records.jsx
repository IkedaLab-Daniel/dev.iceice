import { useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import { API_CONFIG } from '../config/api.config'
import './Records.css'
import { Timer } from 'lucide-react'

const Records = () => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState('All')
  const [showAll, setShowAll] = useState(false)
  const [allTopics, setAllTopics] = useState([])

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.RECORD)
      
      if (response.data.success) {
        const sortedRecords = response.data.data.sort((a, b) => a.day - b.day)
        setRecords(sortedRecords)
        
        // Extract all unique topics
        const topics = new Set()
        sortedRecords.forEach(record => {
          record.topic.forEach(topic => topics.add(topic))
        })
        setAllTopics(['All', ...Array.from(topics).sort()])
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch records')
      console.error('Error fetching records:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
    }
    return `${mins}m`
  }

  // Filter records by selected topic
  const filteredRecords = selectedTopic === 'All' 
    ? records 
    : records.filter(record => record.topic.includes(selectedTopic))

  // Limit displayed records
  const INITIAL_DISPLAY = 6
  const displayedRecords = showAll 
    ? filteredRecords 
    : filteredRecords.slice(0, INITIAL_DISPLAY)

  if (loading) {
    return (
      <section className="records">
        <div className="records-container">
          <div className="loading">Loading records...</div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="records">
        <div className="records-container">
          <div className="error">⚠️ {error}</div>
        </div>
      </section>
    )
  }

  return (
    <section className="records">
      <div className="records-container">
        <h2 className="records-title">Study Records</h2>
        
        {records.length === 0 ? (
          <div className="no-records">No records found!</div>
        ) : (
          <>
            {/* Records Count */}
            <div className="records-count">
              Showing {displayedRecords.length} of {filteredRecords.length} records
            </div>

            {/* Records Grid */}
            <div className="records-grid">
              {displayedRecords.map((record) => (
                <div key={record._id} className="record-card">
                  <div className="record-header">
                    <div className="record-day">Day {record.day}</div>
                    <div className="record-duration">
                        {formatDuration(record.duration)}
                        <Timer size={15} />
                    </div>
                  </div>
                  
                  <div className="record-date">{formatDate(record.date)}</div>
                  
                  <div className="record-topics">
                    {record.topic.map((topic, index) => (
                      <span key={index} className="topic-tag">{topic}</span>
                    ))}
                  </div>
                  
                  {record.description && (
                    <p className="record-description">{record.description}</p>
                  )}
                  
                  {record.link && (
                    <a 
                      href={record.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="record-link"
                    >
                      View Post
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Show More/Hide Button */}
            {filteredRecords.length > INITIAL_DISPLAY && (
              <div className="show-more-container">
                <button 
                  className="show-more-btn"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? 'Show Less' : `Show More (${filteredRecords.length - INITIAL_DISPLAY}) ▼`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default Records
