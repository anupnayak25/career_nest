import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import QuestionCard from "../components/QuestionCard";
import { getUserQuestions } from "../services/ApiService";

const QuestionManagementPage = () => {
  const { type } = useParams(); // Extract type from route
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadQuestions = useCallback(async () => {
    if (!type) return;
    
    console.log('Loading questions for type:', type);
    setLoading(true);
    setQuestions([]); // Clear existing questions immediately
    try {
      const data = await getUserQuestions(type);
      console.log('Loaded questions:', data);
      setQuestions(data || []);
    } catch (error) {
      console.error('Error loading questions:', error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    console.log('useEffect triggered for type:', type);
    loadQuestions();
  }, [type]);

  return (
    <div key={type} className="min-h-screen bg-gray-50 animate-fade-in">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className=" mx-auto px-1 sm:px-2 lg:px-4 py-2">
          <div className="flex justify-between items-center p-4">
            <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {type.charAt(0).toUpperCase() + type.slice(1)} Questions
          </h1>
              <p className="mt-2 text-gray-600">Manage and organize your {type} questions</p>
            </div>
            <button
              onClick={() => navigate(`/add-question/${type}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center shadow-lg">
              <Plus className="mr-2" size={20} />
              Add Question
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto px-2 sm:px-4 lg:px-4 py-4">
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading {type} questions...</h3>
              <p className="text-gray-500">Please wait while we fetch your questions</p>
            </div>
          </div>
        ) : questions.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
              <div className="grid grid-cols-12 gap-4 items-center text-sm font-medium text-gray-700 uppercase tracking-wide">
                <div className="col-span-4">Question Title</div>
                <div className="col-span-2">Due Date</div>
                <div className="col-span-2">Total Marks</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="transition-all duration-200 hover:bg-gray-50"
                  style={{ animationDelay: `${idx * 60}ms` }}>
                  <QuestionCard
                    id={q.id}
                    title={q.title}
                    description={q.description}
                    dueDate={q.due_date}
                    totalMarks={q.total_marks}
                    published={!!q.display_result}
                    type={type}
                    onDeleteSuccess={loadQuestions}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No {type} questions yet</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first {type} question</p>
              <button
                onClick={() => navigate(`/add-question/${type}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center">
                <Plus className="mr-2" size={16} />
                Create Question
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionManagementPage;
