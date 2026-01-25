import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import './CalendarHeatmap.css'

const CalendarHeatmap = ({ records }) => {
  const [hoveredDay, setHoveredDay] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // Calculate contribution data
  const contributionData = useMemo(() => {
    const dataMap = new Map()
    
    records.forEach(record => {
      if (record.date) {
        const date = new Date(record.date)
        const dateStr = date.toISOString().split('T')[0]
        dataMap.set(dateStr, {
          duration: record.duration,
          day: record.day,
          date: dateStr,
          topics: record.topic || []
        })
      }
    })
    
    return dataMap
  }, [records])

  // Get available years from records
  const availableYears = useMemo(() => {
    const years = new Set()
    records.forEach(record => {
      if (record.date) {
        const date = new Date(record.date)
        years.add(date.getFullYear())
      }
    })
    return Array.from(years).sort((a, b) => b - a) // Descending order
  }, [records])

  // Generate data grouped by month (all 12 months of selected year)
  const generateMonthlyData = () => {
    const months = []
    
    // Generate all 12 months for selected year
    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(selectedYear, month, 1)
      const year = selectedYear
      const monthName = monthDate.toLocaleDateString('en-US', { month: 'short' })
      
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      const daysInMonth = lastDay.getDate()
      const startingDayOfWeek = firstDay.getDay()
      
      const days = []
      
      // Add empty cells for days before month starts
      for (let j = 0; j < startingDayOfWeek; j++) {
        days.push(null)
      }
      
      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day)
        const dateStr = date.toISOString().split('T')[0]
        const contribution = contributionData.get(dateStr)
        
        days.push({
          date: dateStr,
          dateObj: date,
          duration: contribution?.duration || 0,
          day: contribution?.day || null,
          topics: contribution?.topics || []
        })
      }
      
      months.push({
        name: monthName,
        year,
        monthIndex: month,
        days
      })
    }
    
    return months
  }

  const monthsData = generateMonthlyData()
  
  // Get intensity level (0-4) based on duration
  const getIntensityLevel = (duration) => {
    if (duration === 0) return 0
    if (duration < 60) return 1
    if (duration < 120) return 2
    if (duration < 180) return 3
    return 4
  }

  // Format date for tooltip
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
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

  const handleMouseEnter = (day, event) => {
    setHoveredDay(day)
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    })
  }

  const handleMouseLeave = () => {
    setHoveredDay(null)
  }

  const previousYear = () => {
    setSelectedYear(prev => prev - 1)
  }

  const nextYear = () => {
    setSelectedYear(prev => prev + 1)
  }

  const goToCurrentYear = () => {
    setSelectedYear(new Date().getFullYear())
  }

  const canGoPrevious = availableYears.length === 0 || selectedYear > Math.min(...availableYears)
  const canGoNext = selectedYear < new Date().getFullYear()

  return (
    <section className="calendar-heatmap">
      <div className="heatmap-container">
        <div className="heatmap-header">
          <h2 className="heatmap-title">Study Activity</h2>
          <div className="year-navigation">
            <button 
              className="btn-year-nav" 
              onClick={previousYear}
              disabled={!canGoPrevious}
            >
              <ChevronLeft size={18} />
            </button>
            <button className="btn-current-year" onClick={goToCurrentYear}>
              {selectedYear}
            </button>
            <button 
              className="btn-year-nav" 
              onClick={nextYear}
              disabled={!canGoNext}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        
        <div className="heatmap-months-wrapper">
          {monthsData.map((monthData, monthIndex) => {
            // Group days into weeks
            const weeks = []
            for (let i = 0; i < monthData.days.length; i += 7) {
              weeks.push(monthData.days.slice(i, i + 7))
            }
            
            return (
              <div key={monthIndex} className="heatmap-month">
                <div className="month-header">
                  <span className="month-name">{monthData.name}</span>
                </div>
                
                <div className="month-calendar">
                  {/* Week day headers */}
                  <div className="weekday-labels">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                      <span key={i} className="weekday-label">{day}</span>
                    ))}
                  </div>
                  
                  {/* Calendar grid */}
                  <div className="month-grid">
                    {weeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="week-row">
                        {week.map((day, dayIndex) => (
                          <div
                            key={dayIndex}
                            className={`heatmap-cell ${
                              day ? `level-${getIntensityLevel(day.duration)}` : 'empty'
                            }`}
                            onMouseEnter={day ? (e) => handleMouseEnter(day, e) : undefined}
                            onMouseLeave={day ? handleMouseLeave : undefined}
                          />
                        ))}
                        {/* Fill remaining cells in the week */}
                        {Array.from({ length: 7 - week.length }).map((_, i) => (
                          <div key={`empty-${i}`} className="heatmap-cell empty" />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="heatmap-legend">
          <span>Less</span>
          <div className="legend-colors">
            <div className="legend-box level-0" />
            <div className="legend-box level-1" />
            <div className="legend-box level-2" />
            <div className="legend-box level-3" />
            <div className="legend-box level-4" />
          </div>
          <span>More</span>
        </div>

        {/* Tooltip */}
        {hoveredDay && (
          <div 
            className="heatmap-tooltip"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
            }}
          >
            {hoveredDay.duration > 0 ? (
              <>
                <div className="tooltip-duration">{formatDuration(hoveredDay.duration)}</div>
                <div className="tooltip-date">{formatDate(hoveredDay.date)}</div>
                {hoveredDay.day && <div className="tooltip-day">Day {hoveredDay.day}</div>}
              </>
            ) : (
              <>
                <div className="tooltip-no-activity">No activity</div>
                <div className="tooltip-date">{formatDate(hoveredDay.date)}</div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default CalendarHeatmap
