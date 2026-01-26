import { useMemo } from 'react'
import { Clock, Flame } from 'lucide-react'
import './Statistics.css'

const Statistics = ({ records: recordsProp = [] }) => {

  const stats = useMemo(() => {
    if (!recordsProp.length) {
      return { totalDays: 0, totalHours: 0, averageHours: 0, topTopics: [] }
    }

    const totalDays = recordsProp.length
    const totalMinutes = recordsProp.reduce((sum, record) => sum + record.duration, 0)
    const totalHours = (totalMinutes / 60).toFixed(1)
    const averageHours = (totalMinutes / totalDays / 60).toFixed(1)

    // Calculate top topics
    const topicCount = {}
    recordsProp.forEach(record => {
      record.topic.forEach(topic => {
        topicCount[topic] = (topicCount[topic] || 0) + 1
      })
    })

    const topTopics = Object.entries(topicCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }))

    return { totalDays, totalHours, averageHours, topTopics }
  }, [recordsProp])

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
                <span>Total Time</span>
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
