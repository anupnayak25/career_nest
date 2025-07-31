// ViewAttempted.jsx - Enhanced UI with table layout
import React, { useEffect, useState } from "react";
import { getSubmittedUsers } from "../services/ApiService";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import StudentCard from "../components/StudentCard";

function ViewAttempted() {
  const navigate = useNavigate();
  const { type, id } = useParams(); // type = quiz/hr/etc, id = question id
  const { attemptedData, setAttemptedData } = useData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttemptedData = async () => {
      try {
        setLoading(true);
        setError("");
        const users = await getSubmittedUsers(type, id);
        if (users && users.message === "No answers yet") {
          setAttemptedData((prev) => ({
            ...prev,
            [`${type}_${id}`]: [],
          }));
        } else {
          setAttemptedData((prev) => ({
            ...prev,
            [`${type}_${id}`]: users.users,
          }));
        }
      } catch (err) {
        setError("Failed to load attempted data");
        console.error("Failed to load attempted data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttemptedData();
  }, [type, id, setAttemptedData]);

  const data = attemptedData[`${type}_${id}`];

  const handleViewAnswers = (userId) => {
    navigate(`/answers/${type}/${id}/${userId}`);
  };

  return (
    <div className="max-w-full mx-auto bg-white rounded-xl shadow-lg px-4 mt-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-3 animate-slide-up">
          <span role="img" aria-label="students">👨‍🎓</span> 
          Attempted Students
        </h1>
        <p className="text-gray-600 mt-2">
          {type?.toUpperCase()} ID: {id}
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12 animate-fade-in">
          <div className="flex items-center gap-3 text-blue-600">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-lg font-medium">Loading students...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-fade-in">
          <div className="flex items-center gap-2 text-red-700">
            <span role="img" aria-label="error">⚠️</span>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {(!data || !Array.isArray(data) || data.length === 0) ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl py-16 text-center animate-fade-in">
              <div className="text-gray-400">
                <span role="img" aria-label="no attempts" className="text-6xl block mb-4">🕵️‍♂️</span>
                <h3 className="text-xl font-semibold mb-2">No Attempts Yet</h3>
                <p className="text-gray-500">Students haven't started attempting this {type} yet.</p>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-gray-600">
                  <span className="font-semibold text-blue-800">{data.length}</span> 
                  {data.length === 1 ? ' student has' : ' students have'} attempted this {type}
                </p>
              </div>
              <StudentCard 
                users={data} 
                onViewAnswers={handleViewAnswers}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ViewAttempted;