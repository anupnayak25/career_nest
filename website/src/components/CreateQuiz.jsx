import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";
import excel from "../assets/excel.png";
import { useToast } from "../ui/Toast";

function CreateQuiz() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    quizQuestions: [],
  });
  const { showToast } = useToast();

  const token = sessionStorage.getItem("auth_token");
  //console.log(token);

  const handleQuizChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (e, qIdx, optIdx = null) => {
    const { name, value } = e.target;
    const updated = [...formData.quizQuestions];
    if (name === "option") {
      updated[qIdx].options[optIdx] = value;
    } else {
      updated[qIdx][name] = value;
    }
    setFormData({ ...formData, quizQuestions: updated });
  };

  const addOption = (qIdx) => {
    const updated = [...formData.quizQuestions];
    updated[qIdx].options.push("");
    setFormData({ ...formData, quizQuestions: updated });
  };

  const removeOption = (qIdx, optIdx) => {
    if (optIdx < 2) return;
    const updated = [...formData.quizQuestions];
    updated[qIdx].options.splice(optIdx, 1);
    setFormData({ ...formData, quizQuestions: updated });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      quizQuestions: [
        ...formData.quizQuestions,
        {
          question: "",
          options: ["", "", "", ""],
          marks: 0,
          correct_ans: "",
        },
      ],
    });
  };

  const removeQuestion = (qIdx) => {
    const updated = [...formData.quizQuestions];
    updated.splice(qIdx, 1);
    setFormData({ ...formData, quizQuestions: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/quiz`, {
        method: "POST", // or 'POST', 'PUT', etc.
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          totalMarks: formData.quizQuestions.reduce((sum, q) => sum + (q.marks || 0), 0),
        }),
      });

      if (!response.ok) throw new Error(` ${response.body} Server error: ${response.status}`);
      await response.json();
      showToast("Quiz created successfully!", "success");
      setTimeout(() => navigate("/dashboard/quiz/"), 1500);
    } catch (error) {
      console.error("Error:", error);
      showToast("Failed to create quiz.", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-blue-800">📝 Create a New Quiz</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quiz Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold">Title *</label>
            <input
              required
              name="title"
              value={formData.title}
              onChange={handleQuizChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Due Date *</label>
            <input
              type="datetime-local"
              required
              name="due_date"
              value={formData.due_date}
              onChange={handleQuizChange}
              className="w-full border rounded p-2"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleQuizChange}
            className="w-full border rounded p-2"
            rows={3}
          />
        </div>

        {/* Quiz Questions */}
        {formData.quizQuestions.map((q, qIdx) => (
          <div key={qIdx} className="border rounded-lg p-4 shadow-sm bg-gray-50 relative">
            <button
              type="button"
              onClick={() => removeQuestion(qIdx)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              title="Remove Question">
              <Trash2 size={18} />
            </button>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Question {qIdx + 1}</h3>

            <input
              placeholder="Enter question"
              name="question"
              value={q.question}
              onChange={(e) => handleQuestionChange(e, qIdx)}
              className="w-full mb-3 border rounded p-2"
              required
            />

            <div className="space-y-2 mb-3">
              {q.options.map((opt, optIdx) => (
                <div key={optIdx} className="flex gap-2 items-center">
                  <input
                    name="option"
                    placeholder={`Option ${optIdx + 1}`}
                    value={opt}
                    onChange={(e) => handleQuestionChange(e, qIdx, optIdx)}
                    className="flex-1 border rounded p-2"
                    required
                  />
                  {optIdx >= 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(qIdx, optIdx)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove Option">
                      <Minus size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addOption(qIdx)}
                className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                <Plus size={16} /> Add Option
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                name="correct_ans"
                placeholder="Correct Answer"
                value={q.correct_ans}
                onChange={(e) => handleQuestionChange(e, qIdx)}
                className="w-full border rounded p-2"
              />
              <input
                name="marks"
                type="number"
                placeholder="Marks"
                value={q.marks}
                onChange={(e) => handleQuestionChange(e, qIdx)}
                className="w-full border rounded p-2"
              />
            </div>
          </div>
        ))}

        {/* Add Question */}
        <button
          type="button"
          onClick={addQuestion}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold">
          + Add Question
        </button>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-bold shadow-md">
          🚀 Submit Quiz
        </button>
      </form>
    </div>
  );
}

export default CreateQuiz;
