'use client'

import { useQuery } from 'react-query'
import { api } from '@/services/api'
import { MapPin, Calendar, Edit, Trash2, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface Trip {
  id: string
  startDate: string
  endDate: string
  startMileage: number
  endMileage: number
  totalMiles: number
  startLocation?: string
  endLocation?: string
  purpose: 'business' | 'personal' | 'mixed'
  businessMiles?: number
  personalMiles?: number
  notes?: string
  source: 'manual' | 'pdf_upload' | 'gps_tracking'
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export function TripsList() {
  const { data: tripsData, isLoading, refetch } = useQuery(
    'trips',
    async () => {
      const response = await api.get('/mileage/trips')
      return response.data.data
    }
  )

  const handleDeleteTrip = async (tripId: string) => {
    if (!confirm('Are you sure you want to delete this trip?')) {
      return
    }

    try {
      await api.delete(`/mileage/trips/${tripId}`)
      toast.success('Trip deleted successfully')
      refetch()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete trip')
    }
  }

  const getPurposeColor = (purpose: string) => {
    switch (purpose) {
      case 'business':
        return 'badge-success'
      case 'personal':
        return 'badge-warning'
      case 'mixed':
        return 'badge-info'
      default:
        return 'badge-info'
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'pdf_upload':
        return '📄'
      case 'gps_tracking':
        return '📍'
      default:
        return '✏️'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  const trips = tripsData?.trips || []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Trips</h2>
        <p className="text-gray-600">View and manage your mileage trips</p>
      </div>

      {trips.length === 0 ? (
        <div className="card">
          <div className="card-content text-center py-12">
            <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
            <p className="text-gray-600 mb-4">Start by adding a trip or uploading a PDF document.</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-content">
            <div className="space-y-4">
              {trips.map((trip: Trip) => (
                <div key={trip.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">
                          {format(new Date(trip.startDate), 'MMM dd, yyyy')}
                        </span>
                        <span className={`badge ${getPurposeColor(trip.purpose)}`}>
                          {trip.purpose}
                        </span>
                        <span className="text-sm text-gray-500">
                          {getSourceIcon(trip.source)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Mileage</p>
                          <p className="font-medium">
                            {trip.startMileage.toLocaleString()} - {trip.endMileage.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total Miles</p>
                          <p className="font-medium text-green-600">{trip.totalMiles}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Business Miles</p>
                          <p className="font-medium">{trip.businessMiles || 0}</p>
                        </div>
                      </div>

                      {trip.startLocation && trip.endLocation && (
                        <div className="mt-2 text-sm text-gray-600">
                          <MapPin className="inline h-3 w-3 mr-1" />
                          {trip.startLocation} → {trip.endLocation}
                        </div>
                      )}

                      {trip.notes && (
                        <div className="mt-2 text-sm text-gray-600">
                          <p className="italic">"{trip.notes}"</p>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <button
                        className="btn btn-secondary btn-sm"
                        title="Edit trip"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTrip(trip.id)}
                        className="btn btn-danger btn-sm"
                        title="Delete trip"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {tripsData?.pagination && tripsData.pagination.pages > 1 && (
              <div className="mt-6 flex justify-center">
                <div className="flex space-x-2">
                  <button className="btn btn-secondary btn-sm">Previous</button>
                  <span className="px-3 py-2 text-sm text-gray-600">
                    Page {tripsData.pagination.page} of {tripsData.pagination.pages}
                  </span>
                  <button className="btn btn-secondary btn-sm">Next</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
