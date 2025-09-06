'use client'

import { useQuery, useQueryClient } from 'react-query'
import { api } from '@/services/api'
import { AlertTriangle, CheckCircle, Clock, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { useState } from 'react'

interface MileageGap {
  id: string
  gapStartDate: string
  gapEndDate: string
  startMileage: number
  endMileage: number
  missingMiles: number
  gapType: 'missing_trip' | 'mileage_inconsistency' | 'date_gap' | 'odometer_rollover'
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'investigating' | 'resolved' | 'ignored'
  description: string
  suggestedAction: string
  createdAt: string
  updatedAt: string
}

export function GapsList() {
  const [resolvingGap, setResolvingGap] = useState<string | null>(null)
  const [resolutionNotes, setResolutionNotes] = useState('')
  const queryClient = useQueryClient()

  const { data: gapsData, isLoading, refetch } = useQuery(
    'gaps',
    async () => {
      const response = await api.get('/mileage/gaps')
      return response.data.data
    }
  )

  const handleResolveGap = async (gapId: string) => {
    if (!resolutionNotes.trim()) {
      toast.error('Please provide resolution notes')
      return
    }

    setResolvingGap(gapId)
    try {
      await api.put(`/mileage/gaps/${gapId}/resolve`, {
        resolutionNotes: resolutionNotes.trim()
      })
      toast.success('Gap resolved successfully')
      setResolutionNotes('')
      refetch()
      queryClient.invalidateQueries('mileage-summary')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to resolve gap')
    } finally {
      setResolvingGap(null)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100'
      case 'high':
        return 'text-orange-600 bg-orange-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'low':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'text-green-600 bg-green-100'
      case 'investigating':
        return 'text-blue-600 bg-blue-100'
      case 'ignored':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-red-600 bg-red-100'
    }
  }

  const getGapTypeLabel = (type: string) => {
    switch (type) {
      case 'missing_trip':
        return 'Missing Trip'
      case 'mileage_inconsistency':
        return 'Mileage Inconsistency'
      case 'date_gap':
        return 'Date Gap'
      case 'odometer_rollover':
        return 'Odometer Rollover'
      default:
        return type
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  const gaps = gapsData?.gaps || []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mileage Gaps</h2>
          <p className="text-gray-600">Review and resolve missing mileage entries</p>
        </div>
        <button
          onClick={() => refetch()}
          className="btn btn-secondary btn-md"
        >
          Refresh Gaps
        </button>
      </div>

      {gaps.length === 0 ? (
        <div className="card">
          <div className="card-content text-center py-12">
            <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No gaps found</h3>
            <p className="text-gray-600">Your mileage records are complete!</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {gaps.map((gap: MileageGap) => (
            <div key={gap.id} className="card">
              <div className="card-content">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <span className="font-medium text-gray-900">
                        {getGapTypeLabel(gap.gapType)}
                      </span>
                      <span className={`badge ${getSeverityColor(gap.severity)}`}>
                        {gap.severity}
                      </span>
                      <span className={`badge ${getStatusColor(gap.status)}`}>
                        {gap.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-2">{gap.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Date Range</p>
                        <p className="font-medium">
                          {format(new Date(gap.gapStartDate), 'MMM dd')} - {format(new Date(gap.gapEndDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Missing Miles</p>
                        <p className="font-medium text-red-600">{gap.missingMiles.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Mileage Range</p>
                        <p className="font-medium">
                          {gap.startMileage.toLocaleString()} - {gap.endMileage.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Suggested Action:</strong> {gap.suggestedAction}
                      </p>
                    </div>
                  </div>
                </div>

                {gap.status === 'open' && (
                  <div className="border-t pt-4">
                    <div className="space-y-3">
                      <div>
                        <label htmlFor={`notes-${gap.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Resolution Notes
                        </label>
                        <textarea
                          id={`notes-${gap.id}`}
                          value={resolutionNotes}
                          onChange={(e) => setResolutionNotes(e.target.value)}
                          placeholder="Describe how you resolved this gap..."
                          className="input min-h-[80px] resize-none"
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setResolutionNotes('')}
                          className="btn btn-secondary btn-sm"
                        >
                          Clear
                        </button>
                        <button
                          onClick={() => handleResolveGap(gap.id)}
                          disabled={resolvingGap === gap.id || !resolutionNotes.trim()}
                          className="btn btn-primary btn-sm"
                        >
                          {resolvingGap === gap.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Resolving...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Resolve Gap
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {gap.status === 'resolved' && (
                  <div className="border-t pt-4">
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Resolved on {format(new Date(gap.updatedAt), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
