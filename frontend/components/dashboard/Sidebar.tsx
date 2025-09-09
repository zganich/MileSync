'use client'

import { Home, MapPin, AlertTriangle, Upload, Plus, LogOut } from 'lucide-react'

type DashboardTab = 'overview' | 'trips' | 'gaps' | 'upload' | 'add-trip'

interface SidebarProps {
  activeTab: DashboardTab
  onTabChange: (tab: DashboardTab) => void
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    {
      id: 'overview' as DashboardTab,
      label: 'Overview',
      icon: Home,
      description: 'Dashboard summary'
    },
    {
      id: 'trips' as DashboardTab,
      label: 'My Trips',
      icon: MapPin,
      description: 'View all trips'
    },
    {
      id: 'gaps' as DashboardTab,
      label: 'Gaps',
      icon: AlertTriangle,
      description: 'Mileage gaps'
    },
    {
      id: 'upload' as DashboardTab,
      label: 'Upload PDF',
      icon: Upload,
      description: 'Upload documents'
    },
    {
      id: 'add-trip' as DashboardTab,
      label: 'Add Trip',
      icon: Plus,
      description: 'Manual entry'
    }
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">MileSync</h1>
            <p className="text-xs text-gray-500">Mileage Tracker</p>
          </div>
        </div>
      </div>

      <nav className="px-4 pb-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                <div className="flex-1 text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </button>
            )
          })}
        </div>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>MileSync v1.0.0</p>
          <p>Simple mileage tracking</p>
        </div>
      </div>
    </div>
  )
}