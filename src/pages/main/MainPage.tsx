import { useState } from 'react'
import './MainPage.css'
import { Sidebar, MapContainer, PlaceDetail } from '../../components'

// 타입 정의
interface Place {
  id: string;
  name: string;
  address: string;
  category: string;
  image?: string;
  isOpen?: boolean;
  savedCount?: number;
  reviewCount?: number;
  rating?: number;
  description?: string;
  phone?: string;
  website?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface MainPageProps {
  onLogout?: () => void;
}

const MainPage: React.FC<MainPageProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<string>('list')
  const [activeFilter, setActiveFilter] = useState<string>('captain')
  const [sortOrder, setSortOrder] = useState<string>('latest')
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)

  const handlePlaceClick = (place: Place) => {
    setSelectedPlace(place)
  }

  const handleCloseDetail = () => {
    setSelectedPlace(null)
  }

  const handleLogout = () => {
    console.log('Logout clicked')
    onLogout?.()
  }

  return (
    <div className="main-page">
      <header className="app-header">
        <div className="header-content">
          <div className="app-title-container">
            <img src="/logo.png" alt="거기어때 로고" className="app-logo" />
          </div>
          <button className="logout-button" onClick={handleLogout}>로그아웃</button>
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

export default MainPage
