'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import { api } from '@/services/api'
import { MapPin, Calendar, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface TripFormData {
  startDate: string
  endDate: string
  startMileage: number
  endMileage: number
  startLocation: string
  endLocation: string
  purpose: 'business' | 'personal' | 'mixed'
  businessMiles?: number
  personalMiles?: number
  notes: string
}

export function AddTrip() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<TripFormData>({
    defaultValues: {
      purpose: 'business',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    }
  })

  const purpose = watch('purpose')
  const startMileage = watch('startMileage')
  const endMileage = watch('endMileage')

  const totalMiles = startMileage && endMileage ? endMileage - startMileage : 0

  const onSubmit = async (data: TripFormData) => {
    if (data.endMileage <= data.startMileage) {
      toast.error('End mileage must be greater than start mileage')
      return
    }

    if (new Date(data.endDate) < new Date(data.startDate)) {
      toast.error('End date cannot be before start date')
      return
    }

    setIsSubmitting(true)
    try {
      await api.post('/mileage/trips', data)
      toast.success('Trip added successfully!')
      reset()
      queryClient.invalidateQueries('trips')
      queryClient.invalidateQueries('mileage-summary')
      queryClient.invalidateQueries('gaps')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add trip')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Add New Trip</h2>
        <p className="text-gray-600">Manually add a mileage trip to your records</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold">Trip Details</h3>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  {...register('startDate', { required: 'Start date is required' })}
                  type="date"
                  className="input"
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  {...register('endDate', { required: 'End date is required' })}
                  type="date"
                  className="input"
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startMileage" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Mileage
                </label>
                <input
                  {...register('startMileage', { 
                    required: 'Start mileage is required',
                    min: { value: 0, message: 'Mileage must be positive' }
                  })}
                  type="number"
                  className="input"
                  placeholder="e.g., 10000"
                />
                {errors.startMileage && (
                  <p className="mt-1 text-sm text-red-600">{errors.startMileage.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="endMileage" className="block text-sm font-medium text-gray-700 mb-1">
                  End Mileage
                </label>
                <input
                  {...register('endMileage', { 
                    required: 'End mileage is required',
                    min: { value: 0, message: 'Mileage must be positive' }
                  })}
                  type="number"
                  className="input"
                  placeholder="e.g., 10050"
                />
                {errors.endMileage && (
                  <p className="mt-1 text-sm text-red-600">{errors.endMileage.message}</p>
                )}
              </div>
            </div>

            {totalMiles > 0 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">
                    Total Miles: {totalMiles.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startLocation" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Location
                </label>
                <input
                  {...register('startLocation')}
                  type="text"
                  className="input"
                  placeholder="e.g., Home, Office"
                />
              </div>

              <div>
                <label htmlFor="endLocation" className="block text-sm font-medium text-gray-700 mb-1">
                  End Location
                </label>
                <input
                  {...register('endLocation')}
                  type="text"
                  className="input"
                  placeholder="e.g., Client Site, Store"
                />
              </div>
            </div>

            <div>
              <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                Trip Purpose
              </label>
              <select
                {...register('purpose', { required: 'Purpose is required' })}
                className="input"
              >
                <option value="business">Business</option>
                <option value="personal">Personal</option>
                <option value="mixed">Mixed (Business & Personal)</option>
              </select>
              {errors.purpose && (
                <p className="mt-1 text-sm text-red-600">{errors.purpose.message}</p>
              )}
            </div>

            {purpose === 'mixed' && totalMiles > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="businessMiles" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Miles
                  </label>
                  <input
                    {...register('businessMiles', {
                      min: { value: 0, message: 'Business miles must be positive' },
                      max: { value: totalMiles, message: 'Business miles cannot exceed total miles' }
                    })}
                    type="number"
                    className="input"
                    placeholder={`Max: ${totalMiles}`}
                  />
                  {errors.businessMiles && (
                    <p className="mt-1 text-sm text-red-600">{errors.businessMiles.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="personalMiles" className="block text-sm font-medium text-gray-700 mb-1">
                    Personal Miles
                  </label>
                  <input
                    {...register('personalMiles', {
                      min: { value: 0, message: 'Personal miles must be positive' },
                      max: { value: totalMiles, message: 'Personal miles cannot exceed total miles' }
                    })}
                    type="number"
                    className="input"
                    placeholder={`Max: ${totalMiles}`}
                  />
                  {errors.personalMiles && (
                    <p className="mt-1 text-sm text-red-600">{errors.personalMiles.message}</p>
                  )}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="input resize-none"
                placeholder="Add any additional details about this trip..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => reset()}
                className="btn btn-secondary btn-md"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Trip...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Add Trip
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
