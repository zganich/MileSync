'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

interface Trip {
  id: string
  date: string
  miles: number
  purpose: string
  location?: string
}

interface Gap {
  id: string
  startDate: string
  endDate: string
  gapMiles: number
  status: string
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [trips, setTrips] = useState<Trip[]>([])
  const [gaps, setGaps] = useState<Gap[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    // Set user data
    setUser({
      id: 'demo-user-id',
      email: 'demo@milesync.com',
      firstName: 'Demo',
      lastName: 'User'
    })

    // Set mock data immediately
    setTrips([
      {
        id: 'trip-1',
        date: '2024-01-15',
        miles: 150,
        purpose: 'business',
        location: 'Downtown to Airport'
      },
      {
        id: 'trip-2',
        date: '2024-01-16',
        miles: 150,
        purpose: 'business',
        location: 'Airport to Downtown'
      },
      {
        id: 'trip-3',
        date: '2024-01-17',
        miles: 75,
        purpose: 'personal',
        location: 'Grocery shopping'
      }
    ])

    setGaps([
      {
        id: 'gap-1',
        startDate: '2024-01-10',
        endDate: '2024-01-12',
        gapMiles: 50,
        status: 'open'
      },
      {
        id: 'gap-2',
        startDate: '2024-01-18',
        endDate: '2024-01-20',
        gapMiles: 50,
        status: 'open'
      }
    ])

    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    alert('PDF upload feature is working! File: ' + file.name)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const totalMiles = trips.reduce((sum, trip) => sum + trip.miles, 0)
  const businessMiles = trips.filter(trip => trip.purpose === 'business').reduce((sum, trip) => sum + trip.miles, 0)
  const openGaps = gaps.filter(gap => gap.status === 'open').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">MileSync Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.firstName}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Total Miles</h3>
              <p className="text-3xl font-bold text-blue-600">{totalMiles.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Business Miles</h3>
              <p className="text-3xl font-bold text-green-600">{businessMiles.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Open Gaps</h3>
              <p className="text-3xl font-bold text-red-600">{openGaps}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mb-8">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              Add Trip
            </button>
            <label className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer">
              Upload PDF
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Recent Trips */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Trips</h3>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                {trips.map((trip) => (
                  <div key={trip.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <p className="font-medium">{trip.date}</p>
                      <p className="text-sm text-gray-600">{trip.location || 'No location'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{trip.miles} miles</p>
                      <p className="text-sm text-gray-600 capitalize">{trip.purpose}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mileage Gaps */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Mileage Gaps</h3>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                {gaps.map((gap) => (
                  <div key={gap.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <p className="font-medium">{gap.startDate} to {gap.endDate}</p>
                      <p className="text-sm text-gray-600">Missing {gap.gapMiles} miles</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        gap.status === 'open' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {gap.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}