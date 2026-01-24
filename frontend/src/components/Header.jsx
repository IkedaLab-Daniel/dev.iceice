import './Header.css'

function Header() {
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
      <button className="primary-button" type="button">
        Connect
      </button>
    </header>
  )
}

export default Header
