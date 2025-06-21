import { BookOpen, Plus } from 'lucide-react'
import React from 'react'

function Quiz() {
  return (
     <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <BookOpen className="mx-auto text-blue-500 mb-4" size={64} />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Management</h2>
              <p className="text-gray-600 mb-6">Create and manage quizzes for your students</p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                <Plus className="inline mr-2" size={16} />
                Create New Quiz
              </button>
            </div>
          </div>
  )
}

export default Quiz
