import { useState } from 'react'
import './App.css'
import { Sidebar, MapContainer, PlaceDetail } from './components'

function App() {
  const [activeTab, setActiveTab] = useState('list')
  const [activeFilter, setActiveFilter] = useState('captain')
  const [sortOrder, setSortOrder] = useState('latest')
  const [selectedPlace, setSelectedPlace] = useState(null)

  const handlePlaceClick = (place) => {
    setSelectedPlace(place)
  }

  const handleCloseDetail = () => {
    setSelectedPlace(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="app-title-container">
            <img src="/logo.png" alt="거기어때 로고" className="app-logo" />
          </div>
          <button className="logout-button">로그아웃</button>
        </div>
      </header>
      
      <main className="app-main">
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          onPlaceClick={handlePlaceClick}
        />
        <MapContainer />
        {selectedPlace && (
          <PlaceDetail place={selectedPlace} onClose={handleCloseDetail} />
        )}
      </main>
    </div>
  )
}

export default App
