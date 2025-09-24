export default function Dashboard() {
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
              <span className="text-gray-700">Welcome, Demo User</span>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">
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
              <p className="text-3xl font-bold text-blue-600">375</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Business Miles</h3>
              <p className="text-3xl font-bold text-green-600">300</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Open Gaps</h3>
              <p className="text-3xl font-bold text-red-600">2</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mb-8">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              Add Trip
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              Upload PDF
            </button>
          </div>

          {/* Recent Trips */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Trips</h3>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium">2024-01-15</p>
                    <p className="text-sm text-gray-600">Downtown to Airport</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">150 miles</p>
                    <p className="text-sm text-gray-600">Business</p>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium">2024-01-16</p>
                    <p className="text-sm text-gray-600">Airport to Downtown</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">150 miles</p>
                    <p className="text-sm text-gray-600">Business</p>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium">2024-01-17</p>
                    <p className="text-sm text-gray-600">Grocery shopping</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">75 miles</p>
                    <p className="text-sm text-gray-600">Personal</p>
                  </div>
                </div>
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
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium">2024-01-10 to 2024-01-12</p>
                    <p className="text-sm text-gray-600">Missing 50 miles</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                      open
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium">2024-01-18 to 2024-01-20</p>
                    <p className="text-sm text-gray-600">Missing 50 miles</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                      open
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}