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
          A visual chronicle of consistent learning. Each day tracked with study duration, topics mastered, and progress milestones. 
          Explore the journey through interactive calendar heatmaps, detailed study records, and tech stack evolution.
        </p>
      </div>
    </main>
  )
}

export default Hero
