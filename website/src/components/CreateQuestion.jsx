import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2, X } from "lucide-react";
import { uploadQuestions } from "../services/ApiService";
import * as XLSX from "xlsx";
import excel from "../assets/excel.png";
import { useData } from "../context/DataContext";
import { useToast } from "../ui/Toast";

function CreateQuestion() {
  const { type } = useParams(); // 👈 get type from URL like /hr or /technical
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    publish_date_time: "", // New field for publish date & time
    due_date_time: "", // New field for due date & time
    total_marks: "",
    questionItems: [
      type === "programming"
        ? { qno: 1, question: "", program_snippet: "", marks: "" }
        : type === "quiz"
        ? { qno: 1, question: "", options: ["", "", "", ""], correct_ans: "", marks: "" }
        : { qno: 1, question: "", marks: "" },
    ],
  });
  const navigate = useNavigate();
  const [excelModalOpen, setExcelModalOpen] = useState(false);
  const [excelError, setExcelError] = useState("");
  const { setPageTitle } = useData();
  const { showToast } = useToast();

  React.useEffect(() => {
    setPageTitle(`Create New ${type.charAt(0).toUpperCase() + type.slice(1)} Attempt`);
    return () => setPageTitle("");
  }, [setPageTitle, type]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      publish_date_time: "", // New field for publish date & time
      due_date_time: "", // New field for due date & time
      total_marks: "",
      questionItems: [
        type === "programming"
          ? { qno: 1, question: "", program_snippet: "", marks: "" }
          : type === "quiz"
          ? { qno: 1, question: "", options: ["", "", "", ""], correct_ans: "", marks: "" }
          : { qno: 1, question: "", marks: "" },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let payload;
    // Added publish_date_time to the payload for all question types and updated due_date to use due_date_time
    if (type === "hr") {
      payload = {
        hrQuestion: {
          title: formData.title,
          description: formData.description,
          due_date: formData.due_date_time, // Updated to use due_date_time
          publish_date: formData.publish_date_time, // Added publish_date_time
          totalMarks: parseInt(formData.total_marks),
        },
        hrQuestionItems: formData.questionItems.map((item, index) => ({
          qno: index + 1,
          question: item.question,
          marks: parseInt(item.marks),
        })),
      };
    } else if (type === "programming") {
      payload = {
        title: formData.title,
        description: formData.description,
        upload_date: new Date().toISOString().slice(0, 10),
        due_date: formData.due_date_time, // Updated to use due_date_time
        publish_date: formData.publish_date_time, // Added publish_date_time
        totalMarks: parseInt(formData.total_marks),
        user_id: sessionStorage.getItem("userId"),
        programQuestions: formData.questionItems.map((item, index) => ({
          qno: index + 1,
          question: item.question,
          program_snippet: item.program_snippet,
          marks: parseInt(item.marks),
        })),
      };
    } else if (type === "quiz") {
      payload = {
        title: formData.title,
        description: formData.description,
        due_date: formData.due_date_time, // Updated to use due_date_time
        publish_date: formData.publish_date_time, // Added publish_date_time
        quizQuestions: formData.questionItems.map((item, index) => ({
          qno: index + 1,
          question: item.question,
          options: item.options,
          marks: parseInt(item.marks),
          correct_ans: item.correct_ans,
        })),
      };
    } else if (type === "technical") {
      payload = {
        title: formData.title,
        description: formData.description,
        upload_date: new Date().toISOString().slice(0, 10),
        due_date: formData.due_date_time, // Updated to use due_date_time
        publish_date: formData.publish_date_time, // Added publish_date_time
        totalMarks: parseInt(formData.total_marks),
        user_id: sessionStorage.getItem("userId"),
        questions: formData.questionItems.map((item, index) => ({
          qno: index + 1,
          question: item.question,
          marks: parseInt(item.marks),
        })),
      };
    }

    // Log the payload before sending to debug the issue
    console.log("Payload:", payload);

    // Ensure publish_date_time is included in the payload and properly set
    if (!formData.publish_date_time) {
      showToast("Publish Date & Time is required!", "error");
      setLoading(false);
      return;
    }

    try {
      await uploadQuestions(type, payload);
      showToast("Question created successfully!", "success");
      resetForm();
      navigate(`/dashboard/${type}`);
    } catch (error) {
      console.error("Error:", error.message);
      showToast("Failed to create question!", "error");
    } finally {
      setLoading(false);
    }
  };

  const addQuestionItem = () => {
    setFormData({
      ...formData,
      questionItems: [
        ...formData.questionItems,
        type === "programming"
          ? { qno: formData.questionItems.length + 1, question: "", program_snippet: "", marks: "" }
          : type === "quiz"
          ? {
              qno: formData.questionItems.length + 1,
              question: "",
              options: ["", "", "", ""],
              correct_ans: "",
              marks: "",
            }
          : { qno: formData.questionItems.length + 1, question: "", marks: "" },
      ],
    });
  };

  const removeQuestionItem = (index) => {
    const updated = formData.questionItems.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      questionItems: updated.map((item, i) => ({ ...item, qno: i + 1 })),
    });
  };

  const updateQuestionItem = (index, field, value) => {
    const updated = [...formData.questionItems];
    if (type === "quiz" && field === "options") {
      updated[index].options = value;
    } else {
      updated[index][field] = value;
    }
    setFormData({ ...formData, questionItems: updated });
  };

  const openExcelFormat = () => setExcelModalOpen(true);
  const closeExcelModal = () => {
    setExcelModalOpen(false);
    setExcelError("");
  };

  const handleExcelFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        // Expecting first row to be headers
        const headers = json[0].map((h) => h.toString().toLowerCase());
        const qIdx = headers.findIndex((h) => h.includes("question"));
        const mIdx = headers.findIndex((h) => h.includes("mark"));
        if (qIdx === -1 || mIdx === -1) {
          setExcelError("Excel must have columns: Question, Marks");
          return;
        }
        const items = json
          .slice(1)
          .filter((row) => row[qIdx] && row[mIdx])
          .map((row, i) => ({
            qno: i + 1,
            question: row[qIdx],
            marks: row[mIdx],
          }));
        if (items.length === 0) {
          setExcelError("No valid questions found in Excel.");
          return;
        }
        setFormData((f) => ({ ...f, questionItems: items }));
        setExcelModalOpen(false);
        setExcelError("");
      } catch {
        setExcelError("Failed to parse Excel file.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Download example Excel file
  const viewExample = (e) => {
    e.preventDefault();
    const ws = XLSX.utils.aoa_to_sheet([
      ["Question", "Marks"],
      ["What is React?", 5],
      ["Explain useState hook.", 10],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Questions");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "question_format_example.xlsx";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div className=" mx-auto bg-white rounded-lg shadow p-6">
      {/* Excel Upload Modal */}
      {excelModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
            <button className="absolute top-2 right-2 text-gray-500" onClick={closeExcelModal}>
              <X />
            </button>
            <h3 className="text-lg font-bold mb-4">Upload Excel File</h3>
            <input type="file" accept=".xlsx,.xls" onChange={handleExcelFile} className="mb-2" />
            <div className="text-xs text-gray-500">Expected columns: Question, Marks</div>
            <button
              className="text-sm px-3 py-1 flex text-green-100 bg-green-700 rounded hover:bg-green-800"
              onClick={viewExample}>
              view example
            </button>
            {excelError && <div className="text-red-600 text-sm mb-2">{excelError}</div>}
          </div>
        </div>
      )}
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-6 capitalize">Create New {type} Attempt</h2>
        <X onClick={() => navigate(`/dashboard/${type}`)} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question Details */}
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            rows="3"
            className="w-full px-3 py-2 border rounded-lg"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Publish Date & Time</label>
            <input
              type="datetime-local"
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.publish_date_time}
              onChange={(e) => setFormData({ ...formData, publish_date_time: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block font-medium">Total Marks</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.total_marks}
              onChange={(e) => setFormData({ ...formData, total_marks: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Due Date & Time</label>
            <input
              type="datetime-local"
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.due_date_time}
              onChange={(e) => setFormData({ ...formData, due_date_time: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Question Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Questions</h3>
            <button
              type="button"
              onClick={openExcelFormat}
              className="text-sm px-3 py-1 flex text-green-100 bg-green-700 rounded hover:bg-green-800">
              Select Excel Format <img className="h-4 m-1" src={excel} alt="excel" />
            </button>
          </div>

          {formData.questionItems.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Question {item.qno}</h4>
                {formData.questionItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestionItem(index)}
                    className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Question</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg"
                  rows="2"
                  value={item.question}
                  onChange={(e) => updateQuestionItem(index, "question", e.target.value)}
                  required
                />
              </div>

              {type === "programming" && (
                <div>
                  <label className="block text-sm font-medium mb-1">Starter Code (optional)</label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg"
                    rows="2"
                    value={item.program_snippet}
                    onChange={(e) => updateQuestionItem(index, "program_snippet", e.target.value)}
                  />
                </div>
              )}

              {type === "quiz" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Options</label>
                    {[0, 1, 2, 3].map((optIdx) => (
                      <input
                        key={optIdx}
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg mb-1"
                        placeholder={`Option ${optIdx + 1}`}
                        value={item.options[optIdx]}
                        onChange={(e) => {
                          const newOptions = [...item.options];
                          newOptions[optIdx] = e.target.value;
                          updateQuestionItem(index, "options", newOptions);
                        }}
                        required
                      />
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Correct Answer (enter option text)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg"
                      value={item.correct_ans}
                      onChange={(e) => updateQuestionItem(index, "correct_ans", e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Marks</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={item.marks}
                  onChange={(e) => updateQuestionItem(index, "marks", e.target.value)}
                  required
                />
              </div>
            </div>
          ))}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={addQuestionItem}
              className="text-sm px-3 w-1/2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
              + Add Questions
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {loading ? "Submitting..." : "Submit Question"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateQuestion;
