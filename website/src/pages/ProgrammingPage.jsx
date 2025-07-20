import { Code, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import Alert from "../ui/AlertDailog";
import { publishResult, deleteQuestion, getUserQuestions } from "../services/ApiService";

function Programming() {
  const navigate = useNavigate();
  const [sets, setSets] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedSet, setSelectedSet] = useState(null);
  const [show, setShow] = useState();

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    setShow(sets.length === 0);
  }, [sets]);

  const loadQuestions = async () => {
    const data = await getUserQuestions("programming");
    setSets(data);
  };

  const handleDelete = async () => {
    try {
      await deleteQuestion("programming", selectedSet.id);
      setSets((prev) => prev.filter((q) => q.id !== selectedSet.id));
      setShowConfirm(false);
    } catch {
      console.error("Delete failed");
    }
  };

  const handlePublish = async (set) => {
    try {
      await publishResult("programming", set.id, true);
      setSets((prev) => prev.map((q) => (q.id === set.id ? { ...q, display_result: 1 } : q)));
    } catch {
      console.error("Failed to publish");
    }
  };

  return (
    <div>
      <div className={`${!show ? "flex justify-between p-2 " : " p-8 text-center"} bg-white mb-6 rounded-xl shadow-lg`}>
        {show && <Code className="mx-auto text-purple-500 mb-4" size={64} />}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Programming Challenges</h2>
        {show && <p className="text-gray-600 mb-6">Create coding assignments and track student progress</p>}
        <button
          className={
            "bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition" +
            `${!show ? " px-1 py-2" : " px-6 py-3"}`
          }
          onClick={() => navigate("/dashboard/add-question/programming")}>
          <Plus className="inline mr-2" size={16} />
          Add Question
        </button>
      </div>
      {sets.length === 0 ? (
        <p className="text-gray-500 text-center mt-8">No programming sets found.</p>
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
                type={"programming"}
                onEdit={() => navigate(`/dashboard/programming/edit/${set.id}`)}
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

export default Programming;
