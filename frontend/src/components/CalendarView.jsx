import { useState, useMemo } from 'react'
import './CalendarView.css'
import { ChevronLeft, ChevronRight, Timer } from 'lucide-react'

const CalendarView = ({ records }) => {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Create a map of dates to records
  const recordsByDate = useMemo(() => {
    const map = new Map()
    records.forEach(record => {
      if (record.date) {
        const date = new Date(record.date)
        const dateStr = date.toISOString().split('T')[0]
        map.set(dateStr, record)
      }
    })
    return map
  }, [records])

  // Get calendar data for current month
  const getCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateStr = date.toISOString().split('T')[0]
      const record = recordsByDate.get(dateStr)
      
      days.push({
        day,
        date: dateStr,
        dateObj: date,
        record
      })
    }
    
    return days
  }

  const calendarDays = getCalendarDays()

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
    }
    return `${mins}m`
  }

  const getTechIcon = (topic) => {
    const iconMap = {
      'js': 'js.svg',
      'react': 'react.svg',
      'node': 'nodeSVG.svg',
      'express': 'express.webp',
      'mongodb': 'mongodb.svg',
      'python': 'python.svg',
      'django': 'django.svg',
      'flask': 'flask-light.svg',
      'html': 'html.svg',
      'css3': 'css3.svg',
      'typeScript': 'typescript.svg',
      'git': 'git.svg',
      'github': 'github.svg',
      'docker': 'docker.png',
      'kubernetes': 'kubernetes.svg',
      'postgreSQL': 'postgresql.svg',
      'mysql': 'mysql.png',
      'tailwind': 'tailwind.svg',
      'bootstrap': 'bootstrap.svg',
      'sass': 'sass.svg',
      'redux': 'redux.svg',
      'vite': 'vite.svg',
      'php': 'php.svg',
      'laravel': 'laravel.svg',
      'prisma': 'prisma.svg',
      'figma': 'figma.svg',
      'sql': 'sqlSVG.svg',
      'ai': 'ai.svg',
      'terminal': 'terminal.svg',
      'security': 'security.svg',
      'cloud': 'cloud.svg',
      'typescript': 'typescript.svg',
      'socket.io': 'socket-io.svg',
      'css': 'css.svg',
      'langchain': 'langchain.svg',
      'llamaindex': 'llamaindex.svg',
      'chromadb': 'chroma.svg',
      'shadcn': 'shadcn.png',
      'gradio': 'gradio.svg',
      'leetcode': 'leetcode.png'
    }

    const fileName = iconMap[topic]
    if (fileName) {
      try {
        return new URL(`../assets/tech-icons/${fileName}`, import.meta.url).href
      } catch {
        return null
      }
    }
    return null
  }

  const monthYear = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  })

  const isToday = (dateStr) => {
    const today = new Date().toISOString().split('T')[0]
    return dateStr === today
  }

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <h3 className="calendar-month">{monthYear}</h3>
        <div className="calendar-controls">
          <button onClick={goToToday} className="btn-today">Today</button>
          <button onClick={previousMonth} className="btn-nav">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} className="btn-nav">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {/* Week day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${!day ? 'empty' : ''} ${
              day?.record ? 'has-record' : ''
            } ${day && isToday(day.date) ? 'today' : ''}`}
          >
            {day && (
              <>
                <div className="day-number">{day.day}</div>
                {day.record && (
                  <div className="day-content">
                    <div className="day-badge">Day {day.record.day}</div>
                    <div className="day-duration">
                      <Timer size={12} />
                      {formatDuration(day.record.duration)}
                    </div>
                    {day.record.topic && day.record.topic.length > 0 && (
                      <div className="day-topics">
                        {day.record.topic.slice(0, 3).map((topic, i) => {
                          const iconUrl = getTechIcon(topic)
                          return iconUrl ? (
                            <img 
                              key={i} 
                              src={iconUrl} 
                              alt={topic} 
                              className="topic-icon-small"
                              title={topic}
                            />
                          ) : null
                        })}
                        {day.record.topic.length > 3 && (
                          <span className="more-topics">+{day.record.topic.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CalendarView
