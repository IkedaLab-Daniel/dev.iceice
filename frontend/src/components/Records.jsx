import { useEffect, useState } from 'react'
// import axiosInstance from '../api/axiosInstance'
// import { API_CONFIG } from '../config/api.config'
import { useAuth } from '../context/AuthContext'
import recordsData from '../data/records.json'
import './Records.css'
import { Timer, Calendar, Tag, Play, Loader2, AlertCircle, X, ChevronDown, ChevronUp, Edit, Plus } from 'lucide-react'
import UpdateRecord from './UpdateRecord'
import AddRecord from './AddRecord'

const Records = () => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState('All')
  const [showAll, setShowAll] = useState(false)
  const [allTopics, setAllTopics] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEmbed, setSelectedEmbed] = useState(null)
  const [embedLoading, setEmbedLoading] = useState(false)
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      setLoading(true)
      
      // Using local JSON data instead of API
      // Filter out empty objects and process the data
      const validRecords = recordsData.filter(record => record._id && record.day)
      
      // Convert MongoDB date format to JavaScript Date
      const processedRecords = validRecords.map(record => ({
        ...record,
        _id: record._id.$oid || record._id,
        date: record.date.$date || record.date,
      }))
      
      const sortedRecords = processedRecords.sort((a, b) => a.day - b.day)
      setRecords(sortedRecords)
      
      // Extract all unique topics
      const topics = new Set()
      sortedRecords.forEach(record => {
        record.topic.forEach(topic => topics.add(topic))
      })
      setAllTopics(['All', ...Array.from(topics).sort()])
      
      // API version (commented out for static deployment):
      // const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.RECORD)
      // if (response.data.success) {
      //   const sortedRecords = response.data.data.sort((a, b) => a.day - b.day)
      //   setRecords(sortedRecords)
      //   const topics = new Set()
      //   sortedRecords.forEach(record => {
      //     record.topic.forEach(topic => topics.add(topic))
      //   })
      //   setAllTopics(['All', ...Array.from(topics).sort()])
      // }
    } catch (err) {
      setError('Failed to load records')
      console.error('Error loading records:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      timeZone: 'Asia/Manila'
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

  const fetchTikTokEmbed = async (tiktokUrl) => {
    try {
      setEmbedLoading(true)
      setModalOpen(true)
      
      // Extract post ID from TikTok URL
      // Supports formats: 
      // - https://www.tiktok.com/@username/video/1234567890
      // - https://www.tiktok.com/@username/photo/1234567890
      const postIdMatch = tiktokUrl.match(/\/(video|photo)\/(\d+)/)
      
      if (postIdMatch && postIdMatch[2]) {
        const postId = postIdMatch[2]
        const embedUrl = `https://www.tiktok.com/embed/v2/${postId}`
        setSelectedEmbed({ embedUrl })
      } else {
        setSelectedEmbed({ error: 'Invalid TikTok URL format' })
      }
    } catch (err) {
      console.error('Error creating TikTok embed:', err)
      setSelectedEmbed({ error: 'Failed to load TikTok video' })
    } finally {
      setEmbedLoading(false)
    }
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedEmbed(null)
  }

  const openUpdateModal = (record) => {
    setSelectedRecord(record)
    setUpdateModalOpen(true)
  }

  const closeUpdateModal = () => {
    setUpdateModalOpen(false)
    setSelectedRecord(null)
  }

  const handleRecordUpdate = (updatedRecord) => {
    setRecords(prevRecords => 
      prevRecords.map(record => 
        record._id === updatedRecord._id ? updatedRecord : record
      )
    )
  }

  const moveToNextRecord = (currentRecord) => {
    // Find the next record by day number
    const currentDay = currentRecord.day
    const nextRecord = records.find(record => record.day === currentDay + 1)
    
    if (nextRecord) {
      setSelectedRecord(nextRecord)
    } else {
      // No more records, close the modal
      closeUpdateModal()
    }
  }

  const openAddModal = () => {
    setAddModalOpen(true)
  }

  const closeAddModal = () => {
    setAddModalOpen(false)
  }

  const handleAddRecord = (newRecord) => {
    setRecords(prevRecords => {
      const updatedRecords = [...prevRecords, newRecord].sort((a, b) => a.day - b.day)
      // Update topics list
      const topics = new Set()
      updatedRecords.forEach(record => {
        record.topic.forEach(topic => topics.add(topic))
      })
      setAllTopics(['All', ...Array.from(topics).sort()])
      return updatedRecords
    })
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
          <div className="loading">
            <Loader2 className="spin-icon" size={24} />
            Loading records...
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="records">
        <div className="records-container">
          <div className="error">
            <AlertCircle size={20} />
            {error}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="records">
      <div className="records-container">
        <div className="records-header">
          <h2 className="records-title">Study Records</h2>
          {/* Add button hidden for static deployment */}
          {/* {isAuthenticated && (
            <button className="btn-add-record" onClick={openAddModal}>
              <Plus size={18} />
              Add Record
            </button>
          )} */}
        </div>
        
        {records.length === 0 ? (
          <div className="no-records">No records found!</div>
        ) : (
          <>
            {/* Show Less Button - Top (visible when expanded) */}
            {showAll && filteredRecords.length > INITIAL_DISPLAY && (
              <div className="show-more-container">
                <button 
                  className="show-more-btn show-less-btn"
                  onClick={() => setShowAll(false)}
                >
                  Show Less
                  <ChevronUp size={18} />
                </button>
              </div>
            )}

            {/* Records Grid */}
            <div className="records-grid">
              {displayedRecords.map((record) => (
                <div key={record._id} className="record-card">
                  <div className="record-header">
                    <div className="record-day">Day {record.day}</div>
                    <div className="record-actions">
                      {/* Edit button hidden for static deployment */}
                      {/* {isAuthenticated && (
                        <button 
                          className="btn-edit"
                          onClick={() => openUpdateModal(record)}
                          title="Edit record"
                        >
                          <Edit size={16} />
                        </button>
                      )} */}
                      <div className="record-duration">
                        {formatDuration(record.duration)}
                        <Timer size={15} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="record-date">
                    <Calendar size={14} />
                    {formatDate(record.date)}
                  </div>
                  
                  <div className="record-topics">
                    {record.topic.map((topic, index) => {
                      const iconUrl = getTechIcon(topic)
                      return (
                        <span key={index} className="topic-tag">
                          {iconUrl ? (
                            <img src={iconUrl} alt={topic} className="tech-icon" />
                          ) : (
                            <Tag size={12} />
                          )}
                        </span>
                      )
                    })}
                  </div>
                  
                  {record.description && (
                    <p className="record-description">{record.description}</p>
                  )}
                  
                  {record.link && (
                    <button 
                      onClick={() => fetchTikTokEmbed(record.link)}
                      className="record-link"
                    >
                      <Play size={16} />
                      View Post
                    </button>
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
                  {showAll ? (
                    <>
                      Show Less
                      <ChevronUp size={18} />
                    </>
                  ) : (
                    <>
                      Show More ({filteredRecords.length - INITIAL_DISPLAY})
                      <ChevronDown size={18} />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* TikTok Video Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <X size={20} />
            </button>
            
            {embedLoading ? (
              <div className="modal-loading">Loading video...</div>
            ) : selectedEmbed?.error ? (
              <div className="modal-error">{selectedEmbed.error}</div>
            ) : selectedEmbed?.embedUrl ? (
              <iframe
                className="tiktok-iframe"
                src={selectedEmbed.embedUrl}
                allowFullScreen
                scrolling="no"
                allow="encrypted-media;"
              />
            ) : null}
          </div>
        </div>
      )}

      {/* Update Record Modal */}
      {updateModalOpen && (
        <UpdateRecord 
          record={selectedRecord}
          onClose={closeUpdateModal}
          onUpdate={handleRecordUpdate}
          onNext={moveToNextRecord}
        />
      )}

      {/* Add Record Modal */}
      {addModalOpen && (
        <AddRecord 
          onClose={closeAddModal}
          onAdd={handleAddRecord}
        />
      )}
    </section>
  )
}

export default Records
