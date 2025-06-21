import { BookOpen, Plus, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Quiz() {
  const navigate = useNavigate()
  const [quizzes, setQuizzes] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedQuiz, setSelectedQuiz] = useState(null)

  useEffect(() => {
    fetch('http://localhost:5000/api/quiz/myposts', {
      headers: { Authorization: localStorage.getItem('career-nest-token') }
    })
      .then(res => res.json())
      .then(setQuizzes)
      .catch(console.error)
  }, [])

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:5000/api/quiz/${selectedQuiz.id}`, {
        method: 'DELETE',
        headers: { Authorization: localStorage.getItem('career-nest-token') }
      })
      setQuizzes(prev => prev.filter(q => q.id !== selectedQuiz.id))
      setShowConfirm(false)
    } catch (err) {
      console.error('Delete failed', err)
      alert('Failed to delete quiz.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6 text-center">
        <BookOpen className="mx-auto text-blue-500 mb-4" size={64} />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Management</h2>
        <p className="text-gray-600 mb-6">Create and manage quizzes for your students</p>
        <button
          onClick={() => navigate('/dashboard/quiz/create')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition"
        >
          <Plus className="inline mr-2" size={16} />
          Create New Quiz
        </button>
      </div>

      {quizzes.length ? (
        <div className="space-y-4">
          {quizzes.map(q => (
            <div
              key={q.id}
              className="relative bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition group"
            >
              <div
                onClick={() => navigate(`/dashboard/quiz/edit/${q.id}`)}
                className="cursor-pointer"
              >
                <h3 className="text-xl font-semibold text-gray-900">{q.title}</h3>
                <p className="text-gray-600 mb-1">{q.description}</p>
                <p className="text-sm text-gray-400">
                  Due: {new Date(q.due_date).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedQuiz(q)
                  setShowConfirm(true)
                }}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-8">No quizzes found.</p>
      )}

      {/* Confirmation Modal */}
      {showConfirm && selectedQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm text-center">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Confirm Delete</h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete the quiz "<strong>{selectedQuiz.title}</strong>"?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Quiz
