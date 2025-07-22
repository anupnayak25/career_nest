// ViewAttempted.jsx - Enhanced UI and logic for no attempts
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
            [`${type}_${id}`]: { users: [] },
          }));
        } else {
          setAttemptedData((prev) => ({
            ...prev,
            [`${type}_${id}`]: { users },
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

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 text-blue-800 flex items-center gap-2 animate-slide-up">
        <span role="img" aria-label="students">👨‍🎓</span> Attempted Students
      </h1>
      {loading && <div className="text-center text-gray-500 py-8 animate-fade-in">Loading...</div>}
      {error && <div className="text-center text-red-500 py-4 animate-fade-in">{error}</div>}
      {!loading && !error && (
        <>
          {(!data || !data.users || data.users.length === 0) ? (
            <div className="text-center text-gray-400 py-12 text-lg font-medium animate-fade-in">
              <span role="img" aria-label="no attempts">🕵️‍♂️</span> No attempts yet
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {data.users.map((user, idx) => (
                <div key={user.user_id} className="transition-all duration-500 transform animate-slide-up" style={{animationDelay: `${idx * 60}ms`}}>
                  <StudentCard
                    userId={user.user_id}
                    onClick={() => navigate(`/answers/${type}/${id}/${user.user_id}`)}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ViewAttempted;
