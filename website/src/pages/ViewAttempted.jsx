// ViewAttempted.jsx
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

  useEffect(() => {
    const fetchAttemptedData = async () => {
      try {
        setLoading(true);
        const users = await getSubmittedUsers(type, id);
        setAttemptedData((prev) => ({
          ...prev,
          [`${type}_${id}`]: { users },
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
        <StudentCard
          key={user.user_id}
          userId={user.user_id}
          onClick={() => navigate(`/answers/${type}/${id}/${user.user_id}`)}
        />
      ))}
    </div>
  );
}

export default ViewAttempted;
