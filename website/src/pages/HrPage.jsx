import React, { useState, useEffect } from "react";
import { Plus, FileText } from "lucide-react";
import { getUserQuestions, publishResult, deleteQuestion } from "../services/ApiService";
import { useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import Alert from "../ui/AlertDailog";

const HRQuestionsManager = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [show, setShow] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    setShow(questions.length === 0);
  }, [questions]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const data = await getUserQuestions("hr");
      setQuestions(data);
    } catch (error) {
      console.error("Error loading questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteQuestion("hr", selectedQuestion.id);
      setQuestions((prev) => prev.filter((q) => q.id !== selectedQuestion.id));
      setShowConfirm(false);
    } catch {
      console.error("Delete failed");
    }
  };

  const handlePublish = async (question) => {
    try {
      await publishResult("hr", question.id, true);
      setQuestions((prev) => prev.map((q) => (q.id === question.id ? { ...q, display_result: 1 } : q)));
    } catch {
      console.error("Failed to publish");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto bg-gray-50 min-h-screen">
      <div className={`${!show ? "flex justify-between p-2 " : " p-8 text-center"} bg-white mb-6 rounded-xl shadow-lg`}>
        {show && <FileText className="mx-auto text-gray-300 mb-4" size={64} />}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">HR Questions Manager</h1>
        {show && <p className="text-gray-400 mb-6">Create your first HR question to get started</p>}
        <button
          onClick={() => {
            navigate("/dashboard/add-question/hr");
          }}
          className={
            "flex items-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium" +
            `${!show ? " px-1 py-2" : " px-6 py-3"}`
          }>
          <Plus className="w-4 h-4 mr-2" />
          Add Question
        </button>
      </div>
      <div className="p-3">
        <div className="space-y-4">
          {questions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No questions created yet</p>
              <p className="text-gray-400">Create your first HR question to get started</p>
            </div>
          ) : (
            questions.map((question) => (
              <QuestionCard
                id={question.id}
                key={question.id}
                title={question.title}
                description={question.description}
                dueDate={question.due_date}
                totalMarks={question.totalMarks}
                published={!!question.display_result}
                type="hr"
                onEdit={() => navigate(`/dashboard/hr/edit/${question.id}`)}
                onDelete={() => {
                  setSelectedQuestion(question);
                  setShowConfirm(true);
                }}
                onPublish={() => handlePublish(question)}
                disablePublish={!!question.display_result}
              />
            ))
          )}
        </div>
      </div>
      <Alert
        isVisible={showConfirm}
        text={`Are you sure you want to delete the question "${selectedQuestion?.title}"?`}
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
};

export default HRQuestionsManager;
