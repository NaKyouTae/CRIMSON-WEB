import { useState } from 'react'
import './App.css'
import { Sidebar, MapContainer } from './components'

function App() {
  const [activeTab, setActiveTab] = useState('list')
  const [activeFilter, setActiveFilter] = useState('captain')
  const [sortOrder, setSortOrder] = useState('latest')

  return (
    <div className="app">
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
      <MapContainer />
    </div>
  )
}

export default App
