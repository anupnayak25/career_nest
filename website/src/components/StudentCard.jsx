import React from "react";

const StudentCard = ({ userId, onClick }) => (
  <div
    className="border p-3 mb-2 rounded shadow-sm bg-white hover:shadow-md transition cursor-pointer"
    onClick={onClick}>
    <div className="flex items-center justify-between">
      <div>
        <span className="font-semibold text-gray-800">User ID:</span> {userId}
      </div>
      <button className="text-blue-600 underline text-sm">View Answers</button>
    </div>
  </div>
);

export default StudentCard;
