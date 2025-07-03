// ViewAttempted.jsx
import React, { useEffect, useState } from "react";
import { getSubmittedUsers, getUserAnswers } from "../services/ApiService";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "../context/DataContext";

function ViewAttempted() {
  const navigate = useNavigate();
  const { type, id } = useParams(); // type = quiz/hr/etc, id = question id
  const { attemptedData, setAttemptedData } = useData();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAttemptedData = async () => {
      try {
        setLoading(true);
        const users = await getSubmittedUsers(type, id);
        console.log("Users:", users); // ✅ confirm users

        const answersByUserId = {};
        // for (const user of users) {
        //   const answers = await getUserAnswers(type, id, user.user_id);
        //   console.log(`Answers for ${user.user_id}:`, answers); // ✅ confirm answer format
        //   answersByUserId[user.user_id] = answers;
        // }

        setAttemptedData((prev) => ({
          ...prev,
          [`${type}_${id}`]: { users, answersByUserId },
        }));
      } catch (err) {
        console.error("Failed to load attempted data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttemptedData();
  }, [type, id, setAttemptedData]);

  const data = attemptedData[`${type}_${id}`];

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Attempted Students</h1>
      {loading && <p>Loading...</p>}
      {data?.users?.map((user) => (
        <div key={user.user_id} className="border p-2 mb-2 rounded shadow-sm">
          <p>
            <strong>User ID:</strong> {user.user_id}
          </p>
          <button
            onClick={() => navigate(`/answers/${type}/${id}/${user.user_id}`)}
            className="text-blue-600 underline">
            View Answers
          </button>
        </div>
      ))}
    </div>
  );
}

export default ViewAttempted;
