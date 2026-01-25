import { createContext, useContext, useState, useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if token exists on mount
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    setIsLoading(false)
  }, [])

  const login = (token) => {
    localStorage.setItem('token', token)
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete axiosInstance.defaults.headers.common['Authorization']
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
