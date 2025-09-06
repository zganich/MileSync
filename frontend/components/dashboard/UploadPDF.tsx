'use client'

import { useState, useRef } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { api } from '@/services/api'
import { Upload, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

interface UploadedFile {
  filename: string
  uploadedAt: string
}

interface ProcessingResult {
  file: {
    filename: string
    originalName: string
    size: number
    uploadedAt: string
  }
  processing: {
    textLength: number
    pageCount: number
    fileSize: number
  }
  extracted: {
    mileageEntries: number
    dates: number
    trips: number
  }
  saved: {
    trips: number
    tripsData: Array<{
      id: string
      date: string
      startMileage: number
      endMileage: number
      totalMiles: number
    }>
  }
  validation: {
    isValid: boolean
    issues: string[]
  }
  gaps: {
    totalGaps: number
    totalMissingMiles: number
    bySeverity: {
      critical: number
      high: number
      medium: number
      low: number
    }
  } | null
}

export function UploadPDF() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<ProcessingResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const { data: uploadedFiles } = useQuery<UploadedFile[]>(
    'uploaded-files',
    async () => {
      const response = await api.get('/upload/files')
      return response.data.data.files
    }
  )

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB')
      return
    }

    setIsUploading(true)
    setUploadResult(null)

    const formData = new FormData()
    formData.append('pdf', file)

    try {
      const response = await api.post('/upload/pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setUploadResult(response.data.data)
      queryClient.invalidateQueries('uploaded-files')
      queryClient.invalidateQueries('mileage-summary')
      queryClient.invalidateQueries('trips')
      queryClient.invalidateQueries('gaps')

      toast.success(`Successfully processed PDF! Found ${response.data.data.saved.trips} trips.`)
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to process PDF')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDeleteFile = async (filename: string) => {
    if (!confirm('Are you sure you want to delete this file and all associated trips?')) {
      return
    }

    try {
      await api.delete(`/upload/files/${filename}`)
      queryClient.invalidateQueries('uploaded-files')
      queryClient.invalidateQueries('mileage-summary')
      queryClient.invalidateQueries('trips')
      queryClient.invalidateQueries('gaps')
      toast.success('File and associated trips deleted successfully')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete file')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Upload PDF Documents</h2>
        <p className="text-gray-600">Upload mileage reports and receipts to automatically extract trip data</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold">Upload New PDF</h3>
        </div>
        <div className="card-content">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="pdf-upload" className="btn btn-primary btn-md cursor-pointer">
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Choose PDF File
                    </>
                  )}
                </label>
                <input
                  ref={fileInputRef}
                  id="pdf-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <p className="mt-2 text-sm text-gray-600">
                  PDF files up to 10MB
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {uploadResult && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Processing Results</h3>
          </div>
          <div className="card-content space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <FileText className="mx-auto h-8 w-8 text-blue-600 mb-2" />
                <p className="text-sm text-gray-600">Pages Processed</p>
                <p className="text-2xl font-bold text-blue-600">{uploadResult.processing.pageCount}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="mx-auto h-8 w-8 text-green-600 mb-2" />
                <p className="text-sm text-gray-600">Trips Found</p>
                <p className="text-2xl font-bold text-green-600">{uploadResult.saved.trips}</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <AlertCircle className="mx-auto h-8 w-8 text-purple-600 mb-2" />
                <p className="text-sm text-gray-600">Gaps Detected</p>
                <p className="text-2xl font-bold text-purple-600">{uploadResult.gaps?.totalGaps || 0}</p>
              </div>
            </div>

            {uploadResult.saved.trips > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Extracted Trips:</h4>
                <div className="space-y-2">
                  {uploadResult.saved.tripsData.map((trip, index) => (
                    <div key={trip.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{format(new Date(trip.date), 'MMM dd, yyyy')}</p>
                        <p className="text-sm text-gray-600">
                          {trip.startMileage.toLocaleString()} - {trip.endMileage.toLocaleString()} miles
                        </p>
                      </div>
                      <span className="font-semibold text-green-600">
                        {trip.totalMiles} miles
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!uploadResult.validation.isValid && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Validation Issues:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {uploadResult.validation.issues.map((issue, index) => (
                    <li key={index}>• {issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {uploadedFiles && uploadedFiles.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Previously Uploaded Files</h3>
          </div>
          <div className="card-content">
            <div className="space-y-2">
              {uploadedFiles.map((file) => (
                <div key={file.filename} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{file.filename}</p>
                      <p className="text-sm text-gray-600">
                        Uploaded {format(new Date(file.uploadedAt), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteFile(file.filename)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
