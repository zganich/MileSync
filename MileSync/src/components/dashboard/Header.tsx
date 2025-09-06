'use client'

import { LogOut, User } from 'lucide-react'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  isActive: boolean
  lastLogin?: string
}

interface HeaderProps {
  user: User | null
  onLogout: () => void
}

export function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">MileSync</h1>
            <p className="text-sm text-gray-600">Mileage tracking made simple</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
            
            <button
              onClick={onLogout}
              className="btn btn-secondary btn-sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
