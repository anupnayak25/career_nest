// src/pages/Technical.jsx
import React, { useEffect, useState } from "react";
import { Cog, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import Alert from "../ui/AlertDailog";
import { getUserQuestions } from "../services/ApiService";

function Technical() {
  const navigate = useNavigate();
  const [sets, setSets] = useState([]);
  const [show, setShow] = useState();

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    const data = await getUserQuestions("technical");
    setSets(data);
  };

  useEffect(() => {
    setShow(sets.length === 0);
  }, [sets]);

  return (
    <div className="p-6 animate-fade-in">
      <div
        className={`${
          !show ? "flex justify-between items-center p-2" : "p-8 text-center flex flex-col items-center"
        } bg-white mb-6 rounded-xl shadow-lg transition-all duration-500 animate-slide-up`}>
        {show && <Cog className="mx-auto text-orange-500 mb-4 animate-fade-in" size={64} />}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 animate-fade-in">Technical Resources</h2>
        {show && <p className="text-gray-600 mb-6 animate-fade-in">Manage technical documentation and resources</p>}
        <button
          className={
            "bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition px-6 py-3 shadow-lg transform hover:scale-105 animate-fade-in"
          }
          onClick={() => navigate("/dashboard/add-question/technical")}>
          <Plus className="inline mr-2" size={16} />
          Add Question
        </button>
      </div>
      {/* {error ? (
        <p className="text-red-500 text-center mt-8 animate-fade-in">{error}</p>
      ) :  */}
      {sets.length === 0 ? (
        <p className="text-gray-500 text-center mt-8 animate-fade-in">No technical sets found.</p>
      ) : (
        <div className="space-y-4 animate-fade-in">
          {sets.map((set, idx) => (
            <div
              key={set.id}
              className="transition-all duration-500 transform animate-slide-up"
              style={{ animationDelay: `${idx * 60}ms` }}>
              <QuestionCard
                id={set.id}
                title={set.title}
                description={set.description}
                dueDate={set.due_date}
                totalMarks={set.totalMarks}
                published={!!set.display_result}
                type="technical"
                onDeleteSuccess={loadQuestions} // Refresh the list after delete
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Technical;
