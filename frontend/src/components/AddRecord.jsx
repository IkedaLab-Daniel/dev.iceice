import { useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import { API_CONFIG } from '../config/api.config'
import { X, Plus, Loader2 } from 'lucide-react'
import './AddRecord.css'

const AddRecord = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    day: '',
    duration: '',
    date: '',
    description: '',
    link: ''
  })
  const [topicInput, setTopicInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)

      // Convert HH:MM format to minutes
      const [hours, minutes] = formData.duration.split(':').map(Number)
      const totalMinutes = (hours * 60) + minutes

      const newRecord = {
        ...formData,
        duration: totalMinutes,
        date: new Date(formData.date).toISOString(),
        topic: topicInput.split(',').map(t => t.trim()).filter(t => t)
      }

      const response = await axiosInstance.post(
        API_CONFIG.ENDPOINTS.RECORD,
        newRecord
      )

      if (response.data.success) {
        onAdd(response.data.data)
        
        // Auto-fill next record with incremented day and date
        const nextDay = parseInt(formData.day) + 1
        const nextDate = new Date(formData.date)
        nextDate.setDate(nextDate.getDate() + 1)
        const nextDateStr = nextDate.toISOString().split('T')[0]
        
        setFormData({
          day: nextDay,
          duration: '',
          date: nextDateStr,
          description: '',
          link: ''
        })
        setTopicInput('')
        setError(null)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create record')
      console.error('Error creating record:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="add-modal-overlay" onClick={onClose}>
      <div className="add-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="add-modal-header">
          <h2>Add New Record</h2>
          <button className="add-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="day">Day</label>
              <input
                type="number"
                id="day"
                name="day"
                value={formData.day}
                onChange={handleChange}
                required
                min="1"
                placeholder="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="duration">Duration (HH:MM)</label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                placeholder="01:30"
                pattern="[0-9]{1,2}:[0-5][0-9]"
              />
              <small>Enter time in hours:minutes format (e.g., 01:30 for 1 hour 30 minutes)</small>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="topic">Topics (comma separated)</label>
            <input
              type="text"
              id="topic"
              name="topic"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              required
              placeholder="e.g., react, node, mongodb"
            />
            <small>Separate multiple topics with commas</small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Optional description..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="link">TikTok Link</label>
            <input
              type="url"
              id="link"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://www.tiktok.com/@username/video/..."
            />
          </div>

          {error && (
            <div className="form-error">{error}</div>
          )}

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-save">
              {loading ? (
                <>
                  <Loader2 className="spin-icon" size={18} />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Add Record
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddRecord
