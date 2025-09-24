import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            MileSync
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Gig driver mileage reconciliation platform
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <Link
              href="/login"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign Up
            </Link>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Demo: demo@milesync.com / demo123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}