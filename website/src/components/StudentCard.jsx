import React from "react";

const StudentCard = ({ userId, onClick }) => (
  <div
    className="flex items-center justify-between border rounded-xl shadow bg-gray-50 hover:bg-blue-50 hover:shadow-lg transition-all cursor-pointer px-5 py-4 group"
    onClick={onClick}>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-xl font-bold text-blue-700 group-hover:bg-blue-400 group-hover:text-white transition">
        {userId?.toString().charAt(0).toUpperCase()}
      </div>
      <div>
        <div className="font-semibold text-gray-800 text-lg">User ID: {userId}</div>
      </div>
    </div>
    <button className="text-blue-600 font-medium text-base underline opacity-80 group-hover:opacity-100 transition">
      View Answers
    </button>
  </div>
);

export default StudentCard;
