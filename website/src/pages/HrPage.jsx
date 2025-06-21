import { User } from 'lucide-react'
import React from 'react'

function Hr() {
  return (
    <div>
      <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <User className="mx-auto text-green-500 mb-4" size={64} />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">HR Management</h2>
              <p className="text-gray-600 mb-6">Manage HR processes and student placements</p>
              <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                View HR Dashboard
              </button>
            </div>
          </div>
    </div>
  )
}

export default Hr
