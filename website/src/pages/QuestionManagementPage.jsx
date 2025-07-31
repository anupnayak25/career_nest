import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import QuestionCard from "../components/QuestionCard";
import { getUserQuestions } from "../services/ApiService";

const QuestionManagementPage = () => {
  const { type } = useParams(); // Extract type from route
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);

  const loadQuestions = useCallback(async () => {
    const data = await getUserQuestions(type);
    setQuestions(data);
  }, [type]); // Add type as a dependency

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]); // Reload when type changes

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-4 py-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="mt-2 text-gray-600">Manage and organize your {type} questions</p>
            </div>
            <button
              onClick={() => navigate(`/dashboard/add-question/${type}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center shadow-lg">
              <Plus className="mr-2" size={20} />
              Add Question
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto px-2 sm:px-4 lg:px-4 py-4">
        {questions.length > 0 ? (
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
                onClick={() => navigate(`/dashboard/add-question/${type}`)}
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
