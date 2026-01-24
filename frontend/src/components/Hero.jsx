import './Hero.css'

function Hero() {
  return (
    <main className="hero">
      {/* <div className="hero-orbit">
        <img src={me} alt="me" className='me'/>
        <div className="orbit-item item-1">JS</div>
        <div className="orbit-item item-2">{'<>'}</div>
        <div className="orbit-item item-3">DB</div>
        <div className="orbit-item item-4">CL</div>
        <div className="orbit-item item-5">{'</>'}</div>
        <div className="orbit-item item-6">UI</div>
      </div> */}

      <div className="hero-copy">
        <h1>
          Studying Web Development
          <span className="accent">1 hour/+ a Day</span>
        </h1>
        <p>
          Documenting the journey from novice to master. Tracking daily
          progress, focus hours, and the tech stack that powers the grind.
        </p>
      </div>
    </main>
  )
}

export default Hero
