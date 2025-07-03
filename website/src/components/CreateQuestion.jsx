import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Trash2, X } from 'lucide-react';
import { uploadQuestions } from '../services/ApiService';

function CreateQuestion() {
  const { type } = useParams(); // 👈 get type from URL like /hr or /technical
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    totalMarks: '',
    questionItems: [
      { qno: 1, question: '', marks: '' } // 👈 default one item
    ]
  });
  const navigate = useNavigate();

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      due_date: '',
      totalMarks: '',
      questionItems: [{ qno: 1, question: '', marks: '' }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      hrQuestion: {
        title: formData.title,
        description: formData.description,
        due_date: formData.due_date,
        totalMarks: parseInt(formData.totalMarks)
      },
      hrQuestionItems: formData.questionItems.map((item, index) => ({
        qno: index + 1,
        question: item.question,
        marks: parseInt(item.marks)
      }))
    };

    try {
      await uploadQuestions(type, payload); // 👈 type from URL
      alert('Question created successfully!');
      resetForm();
      navigate(`/dashboard/${type}`); 
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const addQuestionItem = () => {
    setFormData({
      ...formData,
      questionItems: [
        ...formData.questionItems,
        { qno: formData.questionItems.length + 1, question: '', marks: '' }
      ]
    });
  };

  const removeQuestionItem = (index) => {
    const updated = formData.questionItems.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      questionItems: updated.map((item, i) => ({ ...item, qno: i + 1 }))
    });
  };

  const updateQuestionItem = (index, field, value) => {
    const updated = [...formData.questionItems];
    updated[index][field] = value;
    setFormData({ ...formData, questionItems: updated });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
     <div className='flex justify-between'><h2 className="text-2xl font-bold mb-6 capitalize">
        Create New {type} Attempt
      </h2><X onClick={()=>navigate(`/dashboard/${type}`)} />
      </div> 

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question Details */}
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            rows="3"
            className="w-full px-3 py-2 border rounded-lg"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Due Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block font-medium">Total Marks</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.totalMarks}
              onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Question Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Questions</h3>
            <button
              type="button"
              onClick={addQuestionItem}
              className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              + Add Questions
            </button>
          </div>

          {formData.questionItems.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Question {item.qno}</h4>
                {formData.questionItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestionItem(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Question</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg"
                  rows="2"
                  value={item.question}
                  onChange={(e) => updateQuestionItem(index, 'question', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Marks</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={item.marks}
                  onChange={(e) => updateQuestionItem(index, 'marks', e.target.value)}
                  required
                />
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {loading ? 'Submitting...' : 'Submit Question'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateQuestion;
