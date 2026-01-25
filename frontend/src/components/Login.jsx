import { useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import { API_CONFIG } from '../config/api.config'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'
import { Lock, User, LogIn, AlertCircle } from 'lucide-react'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!username || !password) {
      setError('Please enter both username and password')
      return
    }

    try {
      setLoading(true)
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.LOGIN, {
        username,
        password
      })

      if (response.data.success) {
        // Use AuthContext login
        login(response.data.token)
        
        // Redirect to home
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">
              <Lock size={32} />
            </div>
            <h1 className="login-title">Admin Login</h1>
            <p className="login-subtitle">Access protected features</p>
          </div>

          {error && (
            <div className="login-error">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                <User size={16} />
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                placeholder="Enter your username"
                disabled={loading}
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <Lock size={16} />
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="Enter your password"
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            <button 
              type="submit" 
              className="login-btn"
              disabled={loading}
            >
              {loading ? (
                <>Logging in...</>
              ) : (
                <>
                  <LogIn size={18} />
                  Login
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <button 
              onClick={() => navigate('/')}
              className="back-btn"
              disabled={loading}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
