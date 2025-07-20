// Answers.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUserAnswers, updateUserMarks } from "../services/ApiService";

function Answers() {
  const { type, id, userid } = useParams();
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [marksInputs, setMarksInputs] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAnswers();
  }, [type, id, userid]);

  const fetchAnswers = async () => {
    try {
      setLoading(true);
      // Fetch answers for the specific user
      const answersData = await getUserAnswers(type, id);
      setAnswers(answersData);

      // Fetch questions to get max marks for each question
      const questionsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/${type}/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
        },
      });

      if (questionsResponse.ok) {
        const questionsData = await questionsResponse.json();
        const questionsList = questionsData.questions || questionsData;
        setQuestions(questionsList);

        // Initialize marks inputs with current marks or 0
        const initialMarks = {};
        answersData.forEach((answer) => {
          initialMarks[answer.qno] = answer.marks_awarded || 0;
        });
        setMarksInputs(initialMarks);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarksChange = (qno, value) => {
    setMarksInputs((prev) => ({
      ...prev,
      [qno]: parseInt(value) || 0,
    }));
  };

  const saveMarks = async () => {
    try {
      setSaving(true);

      // Create the update payload
      const updates = answers.map((answer) => ({
        qno: answer.qno,
        marks_awarded: marksInputs[answer.qno] || 0,
      }));

      await updateUserMarks(type, id, userid, updates);

      // Refresh answers to show updated marks
      await fetchAnswers();
      alert("Marks saved successfully!");
    } catch (err) {
      setError(err.message);
      alert("Failed to save marks: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const getQuestionText = (qno) => {
    const question = questions.find((q) => q.qno === qno);
    return question ? question.question : `Question ${qno}`;
  };

  const getMaxMarks = (qno) => {
    const question = questions.find((q) => q.qno === qno);
    return question ? question.marks : 0;
  };

  const calculateTotalMarks = () => {
    return Object.values(marksInputs).reduce((sum, marks) => sum + (marks || 0), 0);
  };

  const getTotalMaxMarks = () => {
    return questions.reduce((sum, q) => sum + (q.marks || 0), 0);
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (!answers || answers.length === 0) return <div className="p-4">No answers available for this user.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Answers Review - {type.toUpperCase()}</h2>
            <p className="text-gray-600">User ID: {userid}</p>
            <p className="text-gray-600">Question Set ID: {id}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">
              Total Marks: {calculateTotalMarks()} / {getTotalMaxMarks()}
            </div>
            <button
              onClick={saveMarks}
              disabled={saving}
              className="mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              {saving ? "Saving..." : "Save Marks"}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {answers.map((answer, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-800">Question {answer.qno}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Max: {getMaxMarks(answer.qno)} marks</span>
                  <input
                    type="number"
                    min="0"
                    max={getMaxMarks(answer.qno)}
                    value={marksInputs[answer.qno] || 0}
                    onChange={(e) => handleMarksChange(answer.qno, e.target.value)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Question:</p>
                <p className="text-gray-800 bg-gray-50 p-3 rounded">{getQuestionText(answer.qno)}</p>
              </div>

              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Student's Answer:</p>
                <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                  {type === "programming" ? (
                    <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">
                      {answer.submitted_code || answer.answer}
                    </pre>
                  ) : (
                    <p className="text-gray-800">{answer.answer || answer.selected_ans}</p>
                  )}
                </div>
              </div>

              {type === "quiz" && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Correct Answer:</p>
                  <p className="text-gray-800 bg-green-50 p-3 rounded border-l-4 border-green-400">
                    {answer.correct_ans || "Not available"}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Previous Marks: {answer.marks_awarded || 0}</span>
                <span>{answer.submitted_at && `Submitted: ${new Date(answer.submitted_at).toLocaleString()}`}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold text-gray-800">
              Final Score: {calculateTotalMarks()} / {getTotalMaxMarks()}
            </div>
            <div className="text-lg font-semibold text-gray-800">
              Percentage: {getTotalMaxMarks() > 0 ? Math.round((calculateTotalMarks() / getTotalMaxMarks()) * 100) : 0}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Answers;
