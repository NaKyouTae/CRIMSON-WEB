import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">CRIMSON-WEB</h1>
        <p className="app-subtitle">거기어때 웹</p>
      </header>
      
      <main className="app-main">
        <div className="welcome-section">
          <h2>환영합니다!</h2>
          <p>CRIMSON-WEB React 애플리케이션에 오신 것을 환영합니다.</p>
        </div>
        
        <div className="demo-section">
          <h3>데모 카운터</h3>
          <div className="counter-card">
            <button 
              className="counter-button"
              onClick={() => setCount((count) => count + 1)}
            >
              클릭 횟수: {count}
            </button>
            <p className="counter-description">
              버튼을 클릭하여 카운터를 테스트해보세요
            </p>
          </div>
        </div>
      </main>
      
      <footer className="app-footer">
        <p>CRIMSON-WEB © 2024</p>
      </footer>
    </div>
  )
}

export default App
