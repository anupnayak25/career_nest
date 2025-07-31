import { BookOpen, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../ui/AlertDailog";
import QuestionCard from "../components/QuestionCard";
import { getUserQuestions } from "../services/ApiService";

function Quiz() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [show, setShow] = useState();

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    setShow(quizzes.length === 0);
  }, [quizzes]);

  const loadQuestions = async () => {
    const data = await getUserQuestions("quiz");
    setQuizzes(data);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in">
      <div
        className={`${
          !show ? "flex justify-between items-center p-2" : "p-8 text-center flex flex-col items-center"
        } bg-white mb-6 rounded-xl shadow-lg transition-all duration-500 animate-slide-up`}>
        {show && <BookOpen className="mx-auto text-blue-500 mb-4 animate-fade-in" size={64} />}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 animate-fade-in">Quiz Management</h2>
        {show && <p className="text-gray-600 mb-6 animate-fade-in">Create and manage quizzes for your students</p>}
        <button
          onClick={() => navigate("/dashboard/add-question/quiz")}
          className={
            "bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition px-6 py-3 shadow-lg transform hover:scale-105 animate-fade-in"
          }>
          <Plus className="inline mr-2" size={16} />
          Add Question
        </button>
      </div>

      {quizzes.length ? (
        <div className="space-y-4 animate-fade-in">
          {quizzes.map((q, idx) => (
            <div
              key={q.id}
              className="transition-all duration-500 transform animate-slide-up"
              style={{ animationDelay: `${idx * 60}ms` }}>
              <QuestionCard
                id={q.id}
                title={q.title}
                description={q.description}
                dueDate={q.due_date}
                totalMarks={q.total_marks}
                published={!!q.display_result}
                type="quiz"
                onDeleteSuccess={loadQuestions} // Refresh the list after delete
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default Quiz;
