import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './MainPage.css'
import { Sidebar, MapContainer, PlaceDetail } from '../../components'
import PlaceGroupMapping from '../../components/sidebar/dynamic/mapping/PlaceGroupMapping'
import { loginAPI } from '../../api/auth'
import { tokenStorage } from '../../api'
import { KakaoPlace, Place } from '../../../generated/dto';

interface MainPageProps {
  onLogout?: () => void;
}

const MainPage: React.FC<MainPageProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('list')
  const [activeFilter, setActiveFilter] = useState<string>('captain')
  const [sortOrder, setSortOrder] = useState<string>('latest')
  const [selectedPlace, setSelectedPlace] = useState<KakaoPlace | null>(null)
  const [searchResults, setSearchResults] = useState<KakaoPlace[]>([])
  const [focusedPlaceIndex, setFocusedPlaceIndex] = useState<number>(-1)
  const [resetMapTrigger, setResetMapTrigger] = useState<number>(0)
  const [showPlaceGroupMapping, setShowPlaceGroupMapping] = useState<boolean>(false)
  const [selectedPlaceForMapping, setSelectedPlaceForMapping] = useState<KakaoPlace | null>(null)
  const [groupPlaces, setGroupPlaces] = useState<Place[]>([])

  const handlePlaceClick = (place: KakaoPlace) => {
    setSelectedPlace(place)
  }

  const handleSearchResults = (results: KakaoPlace[]) => {
    setSearchResults(results)
    setFocusedPlaceIndex(-1) // 검색 결과가 변경되면 포커싱 초기화
  }

  const handlePlaceFocus = (index: number) => {
    setFocusedPlaceIndex(index)
  }

  const handleResetMap = () => {
    setResetMapTrigger(prev => prev + 1)
  }

  const handleAddClick = (place: KakaoPlace) => {
    setSelectedPlaceForMapping(place)
    setShowPlaceGroupMapping(true)
  }

  const handleClosePlaceGroupMapping = () => {
    setShowPlaceGroupMapping(false)
    setSelectedPlaceForMapping(null)
  }

  const handleGroupPlacesChange = (places: Place[]) => {
    setGroupPlaces(places)
  }

  const handleMappingSuccess = () => {
    console.log('장소가 그룹에 성공적으로 추가되었습니다!')
    // 필요시 추가 로직 (예: 그룹 목록 새로고침)
  }

  const handleCloseDetail = () => {
    setSelectedPlace(null)
  }

  const handleLogout = async () => {
    try {
      await loginAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      tokenStorage.clearTokens()
      onLogout?.()
      navigate('/login')
    }
  }

  return (
    <>
      <header>
        <h1><img src="/img/logo/img-logo01.svg" alt="같이갈래 로고" /></h1>
        <ul>
          <li><button className='sm' onClick={handleLogout}>로그아웃</button></li>
        </ul>
      </header>
      <main>
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          onPlaceClick={handlePlaceClick}
          onSearchResults={handleSearchResults}
          onPlaceFocus={handlePlaceFocus}
          onResetMap={handleResetMap}
          onAddClick={handleAddClick}
          focusedPlaceIndex={focusedPlaceIndex}
          onGroupPlacesChange={handleGroupPlacesChange}
        />
        <MapContainer 
          searchResults={searchResults} 
          focusedPlaceIndex={focusedPlaceIndex}
          resetMapTrigger={resetMapTrigger}
          groupPlaces={groupPlaces}
        />
        {selectedPlace && (
          <PlaceDetail place={selectedPlace} onClose={handleCloseDetail} />
        )}
        {showPlaceGroupMapping && selectedPlaceForMapping && (
          <PlaceGroupMapping 
            place={selectedPlaceForMapping} 
            onClose={handleClosePlaceGroupMapping}
            onSuccess={handleMappingSuccess}
          />
        )}
      </main>
    </>
  )
}

export default MainPage
