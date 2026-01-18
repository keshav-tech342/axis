import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Test API connection
    fetch('http://localhost:5000/health')
      .then(res => res.json())
      .then(data => {
        setHealth(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('API Error:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          🚀 AXIS
        </h1>
        <p className="text-gray-600 mb-4">Central Intelligence System</p>
        
        {loading ? (
          <p className="text-gray-500">Connecting to backend...</p>
        ) : health ? (
          <div className="bg-green-100 p-4 rounded">
            <p className="text-green-800 font-semibold">✅ Backend Connected!</p>
            <p className="text-sm text-green-600">{health.message}</p>
          </div>
        ) : (
          <div className="bg-red-100 p-4 rounded">
            <p className="text-red-800">❌ Backend connection failed</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App