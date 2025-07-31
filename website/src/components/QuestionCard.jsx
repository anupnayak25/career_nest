import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Edit3, Trash2, Send, CheckCircle, Calendar, Award, Eye, Clock } from "lucide-react";
import { deleteQuestion, publishResult } from "../services/ApiService";
import Alert from "../ui/AlertDailog";

const QuestionCard = ({ id, type, title, description, dueDate, totalMarks, published, onDeleteSuccess }) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleEdit = () => {
    navigate(`/dashboard/${type}/edit/${id}`);
  };

  const handleView = () => {
    navigate(`/answers/${type}/${id}`);
  };

  const handlePublish = async () => {
    try {
      await publishResult(type, id, true);
      console.log("Published successfully");
    } catch (error) {
      console.error("Failed to publish", error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteQuestion(type, id);
      console.log("Deleted successfully");
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error("Failed to delete", error.message);
    }
  };

  return (
    <>
      <div className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors duration-200">
        {/* Question Title - 4 columns */}
        <div className="col-span-4">
          <div className="cursor-pointer" onClick={handleView}>
            <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-1 line-clamp-1">
              {title}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-1">{description}</p>
          </div>
        </div>

        {/* Due Date - 2 columns */}
        <div className="col-span-2">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span>{dueDate ? new Date(dueDate).toLocaleDateString() : "No deadline"}</span>
          </div>
        </div>

        {/* Total Marks - 2 columns */}
        <div className="col-span-2">
          <div className="flex items-center text-sm text-gray-600">
            <Award className="w-4 h-4 mr-2 text-amber-500" />
            <span className="font-medium">{totalMarks} pts</span>
          </div>
        </div>

        {/* Status - 2 columns */}
        <div className="col-span-2">
          <div className="flex items-center space-x-2">
            {published ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Published
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <Clock className="w-3 h-3 mr-1" />
                Draft
              </span>
            )}
          </div>
        </div>

        {/* Actions - 2 columns */}
        <div className="col-span-2 flex justify-end space-x-1">
          <button
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              handleView();
            }}
            title="View Responses">
            <Eye className="w-4 h-4" />
          </button>

          <button
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit();
            }}
            title="Edit Question">
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            className={`p-2 rounded-lg transition-colors duration-200 ${
              published ? "text-gray-300 cursor-not-allowed" : "text-gray-400 hover:text-green-600 hover:bg-green-50"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (!published) handlePublish();
            }}
            disabled={published}
            title={published ? "Already Published" : "Publish Question"}>
            {published ? <CheckCircle className="w-4 h-4" /> : <Send className="w-4 h-4" />}
          </button>

          <button
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirm(true);
            }}
            title="Delete Question">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <Alert
        isVisible={showConfirm}
        text="Are you sure you want to delete this question?"
        type="warning"
        onResult={(result) => {
          if (result) handleDelete();
          setShowConfirm(false);
        }}
      />

      <style jsx>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default QuestionCard;
