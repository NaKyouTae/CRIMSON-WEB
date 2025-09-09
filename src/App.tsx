import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import './assets/css/reset.css'
import './assets/css/font.css'
import './assets/css/ico.css'
import './assets/css/common.css'
import './assets/css/style.css'
import LoginPage from './pages/login/LoginPage'
import MainPage from './pages/main/MainPage'
import { tokenStorage, setTokenRefreshFailedCallback } from './api'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const accessToken = tokenStorage.getAccessToken()
        const refreshToken = tokenStorage.getRefreshToken()
        
        console.log('🔐 토큰 확인:', { 
          hasAccessToken: !!accessToken, 
          hasRefreshToken: !!refreshToken 
        })
        
        // Access Token과 Refresh Token이 모두 있는지 확인
        if (accessToken && refreshToken) {
          // Access Token이 만료되었는지 확인
          if (!tokenStorage.isTokenExpired(accessToken)) {
            // 토큰이 유효하면 메인 화면으로
            console.log('✅ 유효한 토큰으로 로그인 상태')
            setIsLoggedIn(true)
          } else {
            // Access Token이 만료되었지만 Refresh Token이 있으면
            // API 클라이언트의 인터셉터가 자동으로 갱신을 시도할 것임
            console.log('🔄 Access Token 만료, Refresh Token으로 갱신 시도')
            setIsLoggedIn(true)
          }
        } else {
          // 토큰이 없으면 로그인 페이지로
          console.log('❌ 토큰 없음, 로그인 페이지로 이동')
          setIsLoggedIn(false)
        }
      } catch (error) {
        console.error('❌ 토큰 확인 중 오류:', error)
        setIsLoggedIn(false)
      } finally {
        setIsLoading(false)
      }
    }

    // 토큰 갱신 실패 콜백 설정
    setTokenRefreshFailedCallback(() => {
      console.log('❌ 토큰 갱신 실패, 로그인 페이지로 이동')
      setIsLoggedIn(false)
    })

    checkAuthStatus()
  }, [])

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    try {
      // 토큰 제거
      tokenStorage.clearTokens()
      console.log('🚪 로그아웃 완료, 토큰 제거됨')
      setIsLoggedIn(false)
    } catch (error) {
      console.error('❌ 로그아웃 중 오류:', error)
      setIsLoggedIn(false)
    }
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
    <Router>
      <div className="app">
        <Routes>
          <Route 
            path="/login" 
            element={
              isLoggedIn ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/" 
            element={
              isLoggedIn ? <MainPage onLogout={handleLogout} /> : <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
