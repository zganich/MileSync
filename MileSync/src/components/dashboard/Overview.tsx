'use client'

import { useQuery } from 'react-query'
import { api } from '@/services/api'
import { MapPin, AlertTriangle, TrendingUp, Calendar } from 'lucide-react'
import { format } from 'date-fns'

interface Summary {
  totalTrips: number
  totalMiles: number
  businessMiles: number
  personalMiles: number
  byPurpose: {
    business: number
    personal: number
    mixed: number
  }
  averageDailyMiles: number
  openGaps: number
}

export function Overview() {
  const { data: summary, isLoading } = useQuery<Summary>(
    'mileage-summary',
    async () => {
      const response = await api.get('/mileage/summary')
      return response.data.data.summary
    }
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="card-content">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const stats = [
    {
      name: 'Total Trips',
      value: summary?.totalTrips || 0,
      icon: MapPin,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Total Miles',
      value: summary?.totalMiles || 0,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Business Miles',
      value: summary?.businessMiles || 0,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'Open Gaps',
      value: summary?.openGaps || 0,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600">Your mileage tracking summary</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="card">
              <div className="card-content">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Trip Breakdown</h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Business Trips</span>
                <span className="font-semibold">{summary?.byPurpose.business || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Personal Trips</span>
                <span className="font-semibold">{summary?.byPurpose.personal || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Mixed Purpose</span>
                <span className="font-semibold">{summary?.byPurpose.mixed || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Mileage Summary</h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Business Miles</span>
                <span className="font-semibold">{(summary?.businessMiles || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Personal Miles</span>
                <span className="font-semibold">{(summary?.personalMiles || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Daily</span>
                <span className="font-semibold">{(summary?.averageDailyMiles || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {summary?.openGaps && summary.openGaps > 0 && (
        <div className="card border-l-4 border-red-500">
          <div className="card-content">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  {summary.openGaps} mileage gap{summary.openGaps !== 1 ? 's' : ''} detected
                </h3>
                <p className="text-sm text-red-600">
                  Review the Gaps tab to resolve missing mileage entries.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
