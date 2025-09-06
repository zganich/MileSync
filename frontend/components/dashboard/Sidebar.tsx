'use client'

import { 
  BarChart3, 
  MapPin, 
  AlertTriangle, 
  Upload, 
  Plus,
  Home
} from 'lucide-react'

type DashboardTab = 'overview' | 'trips' | 'gaps' | 'upload' | 'add-trip'

interface SidebarProps {
  activeTab: DashboardTab
  onTabChange: (tab: DashboardTab) => void
}

const navigation = [
  { id: 'overview', name: 'Overview', icon: Home },
  { id: 'trips', name: 'My Trips', icon: MapPin },
  { id: 'gaps', name: 'Gaps', icon: AlertTriangle },
  { id: 'upload', name: 'Upload PDF', icon: Upload },
  { id: 'add-trip', name: 'Add Trip', icon: Plus },
]

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200">
      <nav className="mt-8">
        <div className="px-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id as DashboardTab)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
