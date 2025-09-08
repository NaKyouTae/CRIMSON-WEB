import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './MainPage.css'
import { Sidebar, MapContainer, PlaceDetail } from '../../components'
import { loginAPI } from '../../api/auth'
import { tokenStorage } from '../../api'

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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('list')
  const [activeFilter, setActiveFilter] = useState<string>('captain')
  const [sortOrder, setSortOrder] = useState<string>('latest')
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)

  const handlePlaceClick = (place: Place) => {
    console.log("=======selectedPlace==========");
    console.log(place);
    console.log("=======selectedPlace==========");
    setSelectedPlace(place)
  }

  const handleCloseDetail = () => {
    setSelectedPlace(null)
  }

  const handleLogout = async () => {
    try {
      console.log('Logout clicked')
      
      // 서버에 로그아웃 요청
      await loginAPI.logout()
      
      // 클라이언트에서 토큰 삭제
      tokenStorage.clearTokens()
      
      onLogout?.()
      // 로그인 페이지로 리다이렉트
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // 에러가 발생해도 로컬 토큰은 삭제
      tokenStorage.clearTokens()
      onLogout?.()
      // 로그인 페이지로 리다이렉트
      navigate('/login')
    }
  }

  return (
    <>
      <header>
        <h1><img src="/img/logo/img-logo01.svg" alt="같이갈래 로고" /></h1>
        <ul>
          {/* case01 : 로그인 안 했을 때 */}
          {/* <li><button className='sm'>로그인</button></li> */}
          {/* <li><button className='sm'>회원가입</button></li> */}
          {/* case02 : 로그인 했을 때 */}
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
        />
        <MapContainer />
        {selectedPlace && (
          <PlaceDetail place={selectedPlace} onClose={handleCloseDetail} />
        )}
      </main>
    </>
  )
}

export default MainPage
