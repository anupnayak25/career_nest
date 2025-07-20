import { BookOpen, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/Toast";
import Alert from "../ui/AlertDailog";

function Quiz() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const token = sessionStorage.getItem("auth_token");
  const { showToast } = useToast();
  //console.log(token);

  useEffect(() => {
    fetch(`http://localhost:5000/api/quiz/myposts`, {
      method: "GET", // or 'POST', 'PUT', etc.
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(setQuizzes)
      .catch(console.error);
  }, []);

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:5000/api/quiz/${selectedQuiz.id}`, {
        method: "DELETE",
        headers: { Authorization: localStorage.getItem("career-nest-token") },
      });
      setQuizzes((prev) => prev.filter((q) => q.id !== selectedQuiz.id));
      setShowConfirm(false);
      showToast("Quiz deleted successfully!", "success");
    } catch (err) {
      console.error("Delete failed", err);
      showToast("Failed to delete quiz.", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6 text-center">
        <BookOpen className="mx-auto text-blue-500 mb-4" size={64} />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Management</h2>
        <p className="text-gray-600 mb-6">Create and manage quizzes for your students</p>
        <button
          onClick={() => navigate("/dashboard/add-question/quiz")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition">
          <Plus className="inline mr-2" size={16} />
          Add Question
        </button>
      </div>

      {quizzes.length ? (
        <div className="space-y-4">
          {quizzes.map((q) => (
            <div
              key={q.id}
              className="relative bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition group">
              <div onClick={() => navigate(`/dashboard/quiz/edit/${q.id}`)} className="cursor-pointer">
                <h3 className="text-xl font-semibold text-gray-900">{q.title}</h3>
                <p className="text-gray-600 mb-1">{q.description}</p>
                <p className="text-sm text-gray-400">Due: {new Date(q.due_date).toLocaleString()}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedQuiz(q);
                  setShowConfirm(true);
                }}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-8">No quizzes found.</p>
      )}

      {/* Alert Dialog for Delete Confirmation */}
      <Alert
        isVisible={showConfirm}
        text={`Are you sure you want to delete the quiz "${selectedQuiz?.title}"?`}
        type="warning"
        onResult={(confirmed) => {
          if (confirmed) {
            handleDelete();
          } else {
            setShowConfirm(false);
          }
        }}
      />
    </div>
  );
}

export default Quiz;
