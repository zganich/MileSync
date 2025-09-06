'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Overview } from './Overview'
import { TripsList } from './TripsList'
import { GapsList } from './GapsList'
import { UploadPDF } from './UploadPDF'
import { AddTrip } from './AddTrip'

type DashboardTab = 'overview' | 'trips' | 'gaps' | 'upload' | 'add-trip'

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')
  const { user, logout } = useAuth()

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />
      case 'trips':
        return <TripsList />
      case 'gaps':
        return <GapsList />
      case 'upload':
        return <UploadPDF />
      case 'add-trip':
        return <AddTrip />
      default:
        return <Overview />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex-1 flex flex-col">
          <Header user={user} onLogout={logout} />
          
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  )
}
