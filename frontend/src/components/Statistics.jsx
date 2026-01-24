import { useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import { API_CONFIG } from '../config/api.config'
import { Clock, Flame } from 'lucide-react'
import './Statistics.css'

const Statistics = () => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalDays: 0,
    totalHours: 0,
    averageHours: 0,
    topTopics: [],
  })

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.RECORD)
      
      if (response.data.success) {
        const recordsData = response.data.data
        setRecords(recordsData)
        calculateStats(recordsData)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch records')
      console.error('Error fetching records:', err)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (recordsData) => {
    if (!recordsData.length) {
      setStats({ totalDays: 0, totalHours: 0, averageHours: 0, topTopics: [] })
      return
    }

    const totalDays = recordsData.length
    const totalMinutes = recordsData.reduce((sum, record) => sum + record.duration, 0)
    const totalHours = (totalMinutes / 60).toFixed(1)
    const averageHours = (totalMinutes / totalDays / 60).toFixed(1)

    // Calculate top topics
    const topicCount = {}
    recordsData.forEach(record => {
      record.topic.forEach(topic => {
        topicCount[topic] = (topicCount[topic] || 0) + 1
      })
    })

    const topTopics = Object.entries(topicCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }))

    setStats({ totalDays, totalHours, averageHours, topTopics })
  }

  if (loading) {
    return (
      <section className="statistics">
        <div className="stats-container">
          <div className="loading">Loading statistics...</div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="statistics">
        <div className="stats-container">
          <div className="error">⚠️ {error}</div>
        </div>
      </section>
    )
  }

  return (
    <section className="statistics">
      <div className="stats-container">
        <h2 className="stats-title">Study Statistics</h2>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="top">
                <span>Streak</span>
                <Flame className='icon' />
            </div>

            <div className="stat-value">{stats.totalDays}</div>
            <div className="stat-label">Days</div>
          </div>

          <div className="stat-card">
            <div className="top">
                <span>Total Duration</span>
                <Clock className='icon' />
            </div>

            <div className="stat-value">{stats.totalHours}</div>

            <div className="stat-label">Hours</div>
          </div>

        </div>

      </div>
    </section>
  )
}

export default Statistics
