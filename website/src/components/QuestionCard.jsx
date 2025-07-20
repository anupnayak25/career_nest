import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

const QuestionCard = ({
  id,
  type,
  title,
  description,
  dueDate,
  totalMarks,
  published,
  onEdit,
  onDelete,
  onPublish,
  disablePublish,
}) => {
  const navigate = useNavigate();
  const openAnsweredList = () => {
    navigate(`/answers/${type}/${id}`);
  };

  return (
    <div
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white relative flex justify-between items-center"
      onClick={openAnsweredList}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-3 mb-2">
          <h3 className="text-xl font-semibold text-gray-800 truncate">{title}</h3>
          {published !== undefined && published && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center ml-2">
              Published
            </span>
          )}
        </div>
        <p className="text-gray-600 mb-2 truncate">{description}</p>
        <div className="flex items-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center">Due: {dueDate ? new Date(dueDate).toLocaleDateString() : "-"}</div>
          <div>Total Marks: {totalMarks}</div>
        </div>
      </div>
      <div className="flex flex-col space-y-2 ml-4 shrink-0">
        {onEdit && (
          <button
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}>
            Edit
          </button>
        )}
        {onDelete && (
          <button
            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}>
            Delete
          </button>
        )}
        {onPublish && (
          <button
            className={`px-3 py-1 rounded text-xs ${
              published
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (!published) onPublish();
            }}
            disabled={published || disablePublish}>
            {published ? "Published" : "Publish"}
          </button>
        )}
      </div>
    </div>
  );
};
export default QuestionCard;
