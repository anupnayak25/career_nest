import { Cog, Plus } from 'lucide-react'
import React from 'react'

function Tehnical() {
  return (
    <div>
       <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <Cog className="mx-auto text-orange-500 mb-4" size={64} />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Technical Resources</h2>
              <p className="text-gray-600 mb-6">Manage technical documentation and resources</p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                <Plus className="inline mr-2" size={16} />
                Add Resource
              </button>
            </div>
          </div>
    </div>
  )
}

export default Tehnical
