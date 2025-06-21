import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Trash2, Plus, Minus } from 'lucide-react'

function EditQuiz() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    fetch(`http://localhost:5000/api/quiz/myposts/${id}`, {
      headers: { Authorization: localStorage.getItem('career-nest-token') }
    })
      .then(res => res.json())
      .then(({ quiz, questions }) => {
        const q = quiz[0]
        setFormData({
          id: q.id,
          title: q.title,
          description: q.description,
          due_date: q.due_date.slice(0,16),
          quizQuestions: questions.map(item => ({
            id: item.id,
            question: item.question,
            options: JSON.parse(item.options),
            marks: item.marks,
            correct_ans: item.correct_ans
          }))
        })
      })
      .catch(console.error)
  }, [id])

  if (!formData) return <p>Loading…</p>

  const handleChange = (e, qIdx, optIdx = null) => {
    const { name, value } = e.target
    const updated = { ...formData }
    if (name === 'option') {
      updated.quizQuestions[qIdx].options[optIdx] = value
    } else {
      updated[name] = value || updated[name]
    }
    setFormData(updated)
  }

  const handleQuestionField = (e, qIdx, optIdx = null) => {
    const { name, value } = e.target
    const questions = [...formData.quizQuestions]
    if (name === 'option') {
      questions[qIdx].options[optIdx] = value
    } else {
      questions[qIdx][name] = value
    }
    setFormData({ ...formData, quizQuestions: questions })
  }

  const addOption = qIdx => {
    const questions = [...formData.quizQuestions]
    questions[qIdx].options.push('')
    setFormData({ ...formData, quizQuestions: questions })
  }

  const removeOption = (qIdx, optIdx) => {
    if (optIdx < 2) return
    const questions = [...formData.quizQuestions]
    questions[qIdx].options.splice(optIdx, 1)
    setFormData({ ...formData, quizQuestions: questions })
  }

  const removeQuestion = qIdx => {
    const questions = [...formData.quizQuestions]
    questions.splice(qIdx, 1)
    setFormData({ ...formData, quizQuestions: questions })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`http://localhost:5000/api/quiz/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('career-nest-token')
        },
        body: JSON.stringify(formData)
      })
      console.log(res);
      
      if (!res.ok) throw new Error(res.status)
      await res.json()
      setMessage('Quiz updated!')
      setTimeout(() => navigate('/dashboard/quiz'), 1500)
    } catch(e) {
      console.log(e);
      
      setMessage('Update failed.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-xl">
      <h2 className="text-3xl font-bold mb-4">✏️ Edit Quiz</h2>

      {message && (
        <div
          className={`mb-6 p-4 rounded ${
            message.includes('updated') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Fields */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Due Date</label>
            <input
              name="due_date"
              type="datetime-local"
              value={formData.due_date}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded p-2"
            rows={3}
          />
        </div>

        {/* Questions */}
        {formData.quizQuestions.map((q, i) => (
          <div className="relative border p-4 rounded-lg bg-gray-50 shadow" key={i}>
            <button
              type="button"
              onClick={() => removeQuestion(i)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
            <h4 className="font-semibold mb-2">Q{i + 1}</h4>

            <input
              name="question"
              value={q.question}
              onChange={e => handleQuestionField(e, i)}
              className="w-full border rounded p-2 mb-2"
            />
            {q.options.map((opt, oi) => (
              <div key={oi} className="flex items-center mb-2">
                <input
                  name="option"
                  value={opt}
                  onChange={e => handleQuestionField(e, i, oi)}
                  className="flex-1 border rounded p-2"
                />
                {oi >= 2 && (
                  <button onClick={() => removeOption(i, oi)}>
                    <Minus size={16} className="ml-2 text-red-500 hover:text-red-700" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addOption(i)}
              className="flex items-center text-blue-500 hover:text-blue-700 text-sm font-semibold mb-3"
            >
              <Plus size={16} className="mr-1" /> Add Option
            </button>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                name="correct_ans"
                value={q.correct_ans}
                placeholder="Correct Answer"
                onChange={e => handleQuestionField(e, i)}
                className="border rounded p-2"
              />
              <input
                name="marks"
                type="number"
                value={q.marks}
                placeholder="Marks"
                onChange={e => handleQuestionField(e, i)}
                className="border rounded p-2"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            setFormData({
              ...formData,
              quizQuestions: [
                ...formData.quizQuestions,
                {
                  question: '',
                  options: ['', '', '', ''],
                  marks: 0,
                  correct_ans: ''
                }
              ]
            })
          }
          className="border px-4 py-2 rounded-lg text-gray-800 hover:bg-gray-100"
        >
          + Add Question
        </button>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold">
          Save Changes
        </button>
      </form>
    </div>
  )
}

export default EditQuiz
