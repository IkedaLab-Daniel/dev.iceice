import { Routes, Route } from 'react-router-dom'
import './App.css'
import Hero from './components/Hero'
import Records from './components/Records'
import Statistics from './components/Statistics'
import Login from './components/Login'

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <div className="page">
          <Hero />
          <Statistics />
          <Records />
        </div>
      } />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
