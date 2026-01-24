import { useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'
import { API_CONFIG } from '../config/api.config'
import { X, Save, Loader2 } from 'lucide-react'
import './UpdateRecord.css'

const UpdateRecord = ({ record, onClose, onUpdate, onNext }) => {
  const [formData, setFormData] = useState({
    day: '',
    duration: '',
    date: '',
    topic: [],
    description: '',
    link: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [topicInput, setTopicInput] = useState('')

  useEffect(() => {
    if (record) {
      setFormData({
        day: record.day,
        duration: record.duration,
        date: record.date,
        topic: Array.isArray(record.topic) ? record.topic : [record.topic],
        description: record.description || '',
        link: record.link || ''
      })
      setTopicInput(Array.isArray(record.topic) ? record.topic.join(', ') : record.topic)
    }
  }, [record])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)

      const updateData = {
        ...formData,
        topic: topicInput.split(',').map(t => t.trim()).filter(t => t)
      }

      const response = await axiosInstance.put(
        `${API_CONFIG.ENDPOINTS.RECORD}/${record._id}`,
        updateData
      )

      if (response.data.success) {
        onUpdate(response.data.data)
        if (onNext) {
          onNext(record)
        } else {
          onClose()
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update record')
      console.error('Error updating record:', err)
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
    <div className="update-modal-overlay" onClick={onClose}>
      <div className="update-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="update-modal-header">
          <h2>Update Record - Day {record?.day}</h2>
          <button className="update-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="update-form">
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
              />
            </div>

            <div className="form-group">
              <label htmlFor="duration">Duration (minutes)</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min="1"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="text"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              placeholder="e.g., January 25, 2025"
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
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateRecord
