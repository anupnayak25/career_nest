import { Code, Plus } from 'lucide-react'
import React from 'react'

function Programming() {
  return (
    <div>
       <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <Code className="mx-auto text-purple-500 mb-4" size={64} />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Programming Challenges</h2>
              <p className="text-gray-600 mb-6">Create coding assignments and track student progress</p>
              <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                <Plus className="inline mr-2" size={16} />
                New Challenge
              </button>
            </div>
          </div>
    </div>
  )
}

export default Programming
