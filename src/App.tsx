import { useState, useEffect } from 'react'
import './App.css'
import LoginPage from './pages/login/LoginPage'
import MainPage from './pages/main/MainPage'
import { tokenStorage, setTokenRefreshFailedCallback } from './api'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // 컴포넌트 마운트 시 토큰 확인
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const accessToken = tokenStorage.getAccessToken()
        const refreshToken = tokenStorage.getRefreshToken()
        
        // Access Token과 Refresh Token이 모두 있는지 확인
        if (accessToken && refreshToken) {
          // Access Token이 만료되었는지 확인
          if (!tokenStorage.isTokenExpired(accessToken)) {
            // 토큰이 유효하면 메인 화면으로
            setIsLoggedIn(true)
          } else {
            // Access Token이 만료되었지만 Refresh Token이 있으면
            // API 클라이언트의 인터셉터가 자동으로 갱신을 시도할 것임
            // 갱신 실패 시 자동으로 로그인 페이지로 리다이렉트됨
            setIsLoggedIn(true)
          }
        } else {
          // 토큰이 없으면 로그인 페이지로
          setIsLoggedIn(false)
        }
      } catch (error) {
        console.error('토큰 확인 중 오류:', error)
        setIsLoggedIn(false)
      } finally {
        setIsLoading(false)
      }
    }

    // 토큰 갱신 실패 콜백 설정
    setTokenRefreshFailedCallback(() => {
      setIsLoggedIn(false)
    })

    checkAuthStatus()
  }, [])

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  // 로딩 중일 때는 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <MainPage onLogout={handleLogout} />
      )}
    </div>
  )
}

export default App
