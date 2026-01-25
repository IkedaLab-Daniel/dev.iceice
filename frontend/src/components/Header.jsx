import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { LogOut, LogIn } from 'lucide-react'
import './Header.css'

function Header() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout()
    } else {
      navigate('/login')
    }
  }

  return (
    <header className="site-header">
      <div className="brand">
        <span className="brand-icon" aria-hidden="true">
          {'</>'}
        </span>
        <span className="brand-name">Dev.IceIce</span>
      </div>
      <nav className="site-nav">
        <a href="#">Progress</a>
        <a href="#">Milestones</a>
        <a href="#">Focus</a>
        <a href="#">Links</a>
      </nav>
      <button className="primary-button" type="button" onClick={handleAuthAction}>
        {isAuthenticated ? (
          <>
            <LogOut size={16} />
            Logout
          </>
        ) : (
          <>
            <LogIn size={16} />
            Login
          </>
        )}
      </button>
    </header>
  )
}

export default Header
