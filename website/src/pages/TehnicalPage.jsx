// src/pages/Technical.jsx
import React, { useEffect, useState } from "react";
import { Cog, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import Alert from "../ui/AlertDailog";
import { publishResult, deleteQuestion } from "../services/ApiService";

function Technical() {
  const navigate = useNavigate();
  const [sets, setSets] = useState([]);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedSet, setSelectedSet] = useState(null);
  const token = sessionStorage.getItem("auth_token");
  const [show, setShow] = useState();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/technical/myposts`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSets(data);
          setError(null);
        } else {
          setSets([]);
          setError(data?.message || "Unexpected error");
        }
      })
      .catch(() => {
        setSets([]);
        setError("Network error or server not reachable");
      });
  }, []);

  useEffect(() => {
    setShow(sets.length === 0);
  }, [sets]);

  const handleDelete = async () => {
    try {
      await deleteQuestion("technical", selectedSet.id);
      setSets((prev) => prev.filter((q) => q.id !== selectedSet.id));
      setShowConfirm(false);
    } catch {
      console.error("Delete failed");
    }
  };

  const handlePublish = async (set) => {
    try {
      await publishResult("technical", set.id, true);
      setSets((prev) => prev.map((q) => (q.id === set.id ? { ...q, display_result: 1 } : q)));
    } catch {
      console.error("Failed to publish");
    }
  };

  return (
    <div className="p-6">
      <div className={`${!show ? "flex justify-between p-2 " : " p-8 text-center"} bg-white mb-6 rounded-xl shadow-lg`}>
        {show && <Cog className="mx-auto text-orange-500 mb-4" size={64} />}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Technical Resources</h2>
        {show && <p className="text-gray-600 mb-6">Manage technical documentation and resources</p>}
        <button
          className={
            "bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition" +
            `${!show ? " px-1 py-2" : " px-6 py-3"}`
          }
          onClick={() => navigate("/dashboard/add-question/technical")}>
          <Plus className="inline mr-2" size={16} />
          Add Question
        </button>
      </div>
      {error ? (
        <p className="text-red-500 text-center mt-8">{error}</p>
      ) : sets.length === 0 ? (
        <p className="text-gray-500 text-center mt-8">No technical sets found.</p>
      ) : (
        <div className="space-y-4">
          {Array.isArray(sets) &&
            sets.map((set) => (
              <QuestionCard
                id={set.id}
                key={set.id}
                title={set.title}
                description={set.description}
                dueDate={set.due_date}
                totalMarks={set.total_marks}
                published={!!set.display_result}
                type={"technical"}
                onEdit={() => navigate(`/dashboard/technical/edit/${set.id}`)}
                onDelete={() => {
                  setSelectedSet(set);
                  setShowConfirm(true);
                }}
                onPublish={() => handlePublish(set)}
                disablePublish={!!set.display_result}
              />
            ))}
        </div>
      )}
      <Alert
        isVisible={showConfirm}
        text={`Are you sure you want to delete the set "${selectedSet?.title}"?`}
        type="warning"
        onResult={(confirmed) => {
          if (confirmed) {
            handleDelete();
          } else {
            setShowConfirm(false);
          }
        }}
      />
    </div>
  );
}

export default Technical;
