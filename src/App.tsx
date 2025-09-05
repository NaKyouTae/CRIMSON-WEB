import { useState } from 'react'
import './App.css'
import LoginPage from './pages/login/LoginPage'
import MainPage from './pages/main/MainPage'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
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
