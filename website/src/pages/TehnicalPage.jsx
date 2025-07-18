// src/pages/Technical.jsx
import React from "react";
import { Cog, Plus } from "lucide-react";
import { useData } from "../context/DataContext"; // Ensure correct path
import { useNavigate } from "react-router-dom";

function Technical() {
  const { attemptedData, setAttemptedData } = useData();
  const navigate = useNavigate();

  // const handleAddResource = () => {
  //   const typeId = "tech-1";
  //   const newUserId = "U00" + Math.floor(Math.random() * 100);
  //   const newAnswers = ["A", "B", "C"];

  //   setAttemptedData((prev) => ({
  //     ...prev,
  //     [typeId]: {
  //       users: [...(prev[typeId]?.users || []), newUserId],
  //       answersByUserId: {
  //         ...(prev[typeId]?.answersByUserId || {}),
  //         [newUserId]: newAnswers,
  //       },
  //     },
  //   }));
  // };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <Cog className="mx-auto text-orange-500 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Technical Resources</h2>
          <p className="text-gray-600 mb-6">Manage technical documentation and resources</p>
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            onClick={() => navigate("/dashboard/add-question/technical")}>
            <Plus className="inline mr-2" size={16} />
            Add Question
          </button>
        </div>

        {/* Display Attempted Data */}
        <div className="mt-8 text-left">
          <h3 className="text-xl font-semibold mb-4">Attempted Users</h3>
          {Object.entries(attemptedData).length === 0 ? (
            <p className="text-gray-500">No users have attempted yet.</p>
          ) : (
            Object.entries(attemptedData).map(([typeId, data]) => (
              <div key={typeId} className="mb-6">
                <h4 className="text-lg font-bold mb-2">Type ID: {typeId}</h4>
                <ul className="list-disc list-inside space-y-2">
                  {data.users.map((userId, index) => (
                    <li key={index}>
                      <span className="font-medium text-gray-800">{userId}</span>:&nbsp;
                      <span className="text-gray-600">{data.answersByUserId[userId].join(", ")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Technical;
