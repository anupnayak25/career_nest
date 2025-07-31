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
    <div className="group border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-gray-300 transition-all duration-300 cursor-pointer bg-white relative overflow-hidden">
      {/* Background gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/30 group-hover:to-purple-50/30 transition-all duration-300 pointer-events-none" />

      <div className="relative flex justify-between items-start" onClick={handleView}>
        <div className="flex-1 min-w-0 pr-4">
          {/* Header with title and status */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors mb-2 line-clamp-2">
                {title}
              </h3>
              <div className="flex items-center space-x-2">
                {published !== undefined && published && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Published
                  </span>
                )}
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 capitalize">
                  {type}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{description}</p>

          {/* Metadata with enhanced styling */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border">
              <Calendar className="w-4 h-4 mr-2 text-blue-500" />
              <span className="font-medium">Due:</span>
              <span className="ml-1">{dueDate ? new Date(dueDate).toLocaleDateString() : "No deadline"}</span>
            </div>
            <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border">
              <Award className="w-4 h-4 mr-2 text-amber-500" />
              <span className="font-medium">Marks:</span>
              <span className="ml-1 font-semibold text-gray-700">{totalMarks}</span>
            </div>
          </div>
        </div>

        {/* Action buttons with enhanced styling */}
        <div className="flex  space-y-2 ml-4 shrink-0">
          <button
            className="p-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 group/btn shadow-sm hover:shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              handleView();
            }}
            title="View Responses">
            <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          </button>

          <button
            className="p-2.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 hover:scale-105 transition-all duration-200 group/btn shadow-sm hover:shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit();
            }}
            title="Edit">
            <Edit3 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          </button>

          <button
            className="p-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 hover:scale-105 transition-all duration-200 group/btn shadow-sm hover:shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirm(true);
            }}
            title="Delete">
            <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          </button>

          <button
            className={`p-2.5 rounded-lg transition-all duration-200 group/btn shadow-sm hover:shadow-md ${
              published
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-green-100 text-green-700 hover:bg-green-200 hover:scale-105"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (!published) handlePublish();
            }}
            disabled={published}
            title={published ? "Already Published" : "Publish"}>
            {published ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Send className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            )}
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
    </div>
  );
};
export default QuestionCard;
