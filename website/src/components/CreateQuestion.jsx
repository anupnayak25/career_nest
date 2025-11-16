import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2, X, Video, FileText, AlertCircle, Play, Square, RotateCcw } from "lucide-react";
import { uploadQuestions, uploadVideoFile } from "../services/ApiService";
import * as XLSX from "xlsx";
import excel from "../assets/excel.png";
import { useData } from "../context/DataContext";
import { useToast } from "../ui/Toast";

function CreateQuestion() {
  const { type } = useParams(); // 👈 get type from URL like /hr or /technical
  const [loading, setLoading] = useState(false);
  const [recordingStates, setRecordingStates] = useState({});
  const [mediaRecorders, setMediaRecorders] = useState({});
  const [uploadingVideo, setUploadingVideo] = useState({}); // per-question uploading state
  const videoRefs = React.useRef({});
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
        : {
            qno: 1,
            question: "",
            marks: "",
            answer_type: "video", // Default to video
            answer_url: "NA",
            answer_transcript: "NA",
            recorded_video: null,
          },
    ],
  });
  const navigate = useNavigate();
  const [excelModalOpen, setExcelModalOpen] = useState(false);
  const [excelError, setExcelError] = useState("");
  const { setPageTitle } = useData();
  const { showToast } = useToast();

  // Normalize any returned URL/path to just the filename (DB stores filenames; URLs can change)
  const getFilenameFromValue = (val) => {
    if (!val || typeof val !== "string") return "";
    try {
      const base = val.split("?")[0].split("#")[0];
      const parts = base.split("/");
      return parts[parts.length - 1] || val;
    } catch {
      return val;
    }
  };

  // Auto-calculate total marks from sub-questions
  const computedTotal = React.useMemo(() => {
    try {
      return (formData.questionItems || []).reduce((sum, item) => {
        const val = parseInt(item?.marks, 10);
        return sum + (Number.isFinite(val) ? val : 0);
      }, 0);
    } catch {
      return 0;
    }
  }, [formData.questionItems]);

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
          : {
              qno: 1,
              question: "",
              marks: "",
              answer_type: "video",
              answer_url: "NA",
              answer_transcript: "NA",
              recorded_video: null,
            },
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
          totalMarks: computedTotal,
        },
        hrQuestionItems: formData.questionItems.map((item, index) => ({
          qno: index + 1,
          question: item.question,
          marks: parseInt(item.marks),
          answer_url: item.answer_url || "NA",
          answer_transcript: item.answer_transcript || "NA",
        })),
      };
    } else if (type === "programming") {
      payload = {
        title: formData.title,
        description: formData.description,
        upload_date: new Date().toISOString().slice(0, 10),
        due_date: formData.due_date_time, // Updated to use due_date_time
        publish_date: formData.publish_date_time, // Added publish_date_time
        totalMarks: computedTotal,
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
        totalMarks: computedTotal,
        user_id: sessionStorage.getItem("userId"),
        questions: formData.questionItems.map((item, index) => ({
          qno: index + 1,
          question: item.question,
          marks: parseInt(item.marks),
          answer_url: item.answer_url || "NA",
          answer_transcript: item.answer_transcript || "NA",
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
          : {
              qno: formData.questionItems.length + 1,
              question: "",
              marks: "",
              answer_type: "video",
              answer_url: "NA",
              answer_transcript: "NA",
              recorded_video: null,
            },
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
    } else if ((type === "hr" || type === "technical") && field === "answer_type") {
      updated[index].answer_type = value;
      // Reset the other fields based on selection
      if (value === "video") {
        updated[index].answer_transcript = "NA";
      } else if (value === "transcript") {
        updated[index].answer_url = "NA";
        updated[index].recorded_video = null;
      }
    } else {
      updated[index][field] = value;
    }
    setFormData({ ...formData, questionItems: updated });
  };

  // Video recording functionality
  const startRecording = async (questionIndex) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const videoUrl = URL.createObjectURL(blob);
        // Show local preview until upload finishes
        updateQuestionItem(questionIndex, "recorded_video", videoUrl);
        // Stop camera and clear live preview
        stream.getTracks().forEach((track) => track.stop());
        if (videoRefs.current[questionIndex]) {
          videoRefs.current[questionIndex].srcObject = null;
        }
        // Immediately upload the recorded video and store only the filename
        await uploadRecordedVideo(questionIndex, blob);
      };

      setMediaRecorders((prev) => ({ ...prev, [questionIndex]: mediaRecorder }));
      setRecordingStates((prev) => ({ ...prev, [questionIndex]: "recording" }));

      // Show preview
      if (videoRefs.current[questionIndex]) {
        videoRefs.current[questionIndex].srcObject = stream;
      }

      mediaRecorder.start();
      showToast("Recording started!", "success");
    } catch (error) {
      console.error("Error accessing media devices:", error);
      showToast("Failed to access camera/microphone!", "error");
    }
  };

  const stopRecording = (questionIndex) => {
    const mediaRecorder = mediaRecorders[questionIndex];
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setRecordingStates((prev) => ({ ...prev, [questionIndex]: "stopped" }));
      showToast("Recording stopped!", "success");
    }
  };

  const resetRecording = (questionIndex) => {
    const mediaRecorder = mediaRecorders[questionIndex];
    if (mediaRecorder) {
      if (mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      }
    }

    // Clear the recorded video
    updateQuestionItem(questionIndex, "recorded_video", null);
    setRecordingStates((prev) => ({ ...prev, [questionIndex]: "idle" }));

    // Clear video preview
    if (videoRefs.current[questionIndex]) {
      videoRefs.current[questionIndex].srcObject = null;
    }

    showToast("Recording reset!", "info");
  };

  // Upload a selected video file for a given question and set answer_url to the server filename
  const handleVideoFileSelect = async (questionIndex, file) => {
    if (!file) return;
    try {
      setUploadingVideo((prev) => ({ ...prev, [questionIndex]: true }));
      const fd = new FormData();
      fd.append("video", file);
      const resp = await uploadVideoFile(fd);
      if (resp && resp.success && (resp.filename || resp.url)) {
        const filename = getFilenameFromValue(resp.filename || resp.url);
        updateQuestionItem(questionIndex, "answer_url", filename);
        // clear any local-only recorded preview to avoid confusion
        updateQuestionItem(questionIndex, "recorded_video", null);
        showToast("Video uploaded and linked to the question.", "success");
      } else {
        showToast("Upload failed: invalid server response.", "error");
      }
    } catch (e) {
      console.error("Video upload failed:", e.message);
      showToast(e.message || "Failed to upload video.", "error");
    } finally {
      setUploadingVideo((prev) => ({ ...prev, [questionIndex]: false }));
    }
  };

  // Upload the recorded blob right after recording stops and store only the filename
  const uploadRecordedVideo = async (questionIndex, blob) => {
    if (!blob) return;
    try {
      setUploadingVideo((prev) => ({ ...prev, [questionIndex]: true }));
      const file = new File([blob], `recording_${Date.now()}.webm`, { type: "video/webm" });
      const fd = new FormData();
      fd.append("video", file);
      const resp = await uploadVideoFile(fd);
      if (resp && resp.success && (resp.filename || resp.url)) {
        const filename = getFilenameFromValue(resp.filename || resp.url);
        updateQuestionItem(questionIndex, "answer_url", filename);
        // Clear local-only preview now that it's on the server
        updateQuestionItem(questionIndex, "recorded_video", null);
        showToast("Recording uploaded successfully.", "success");
      } else {
        showToast("Upload failed: invalid server response.", "error");
      }
    } catch (e) {
      console.error("Recorded video upload failed:", e.message);
      showToast(e.message || "Failed to upload recorded video.", "error");
      // Keep local preview so the user can retry by uploading the file or re-recording
    } finally {
      setUploadingVideo((prev) => ({ ...prev, [questionIndex]: false }));
    }
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

  // Download example Excel file (dynamic columns based on type)
  const viewExample = (e) => {
    e.preventDefault();
    let data = [];
    let filename = "question_format_example.xlsx";
    if (type === "quiz") {
      data = [
        ["Question", "Option 1", "Option 2", "Option 3", "Option 4", "Correct Answer", "Marks"],
        ["What is React?", "A library", "A framework", "A language", "A database", "A library", 5],
        ["What is useState?", "A hook", "A prop", "A component", "A reducer", "A hook", 10],
      ];
      filename = "quiz_format_example.xlsx";
    } else if (type === "programming") {
      data = [
        ["Question", "Starter Code", "Marks"],
        ["Write a function to add two numbers.", "def add(a, b):\n    return a + b", 10],
        ["Reverse a string.", "def reverse(s):\n    return s[::-1]", 15],
      ];
      filename = "programming_format_example.xlsx";
    } else if (type === "hr" || type === "technical") {
      data = [
        ["Question", "Marks", "Answer Type", "Sample Answer/URL"],
        ["Tell us about yourself.", 10, "video", "NA"],
        ["Describe a challenge you faced.", 15, "transcript", "Sample transcript here"],
      ];
      filename = `${type}_format_example.xlsx`;
    } else {
      data = [
        ["Question", "Marks"],
        ["Sample question?", 5],
      ];
    }
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Questions");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white capitalize">Create New {type} Assessment</h2>
              <button
                onClick={() => navigate(`/dashboard/${type}`)}
                className="text-white hover:text-gray-200 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          {/* Excel Upload Modal */}
          {excelModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl shadow-xl w-96 max-w-md mx-4 relative">
                <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={closeExcelModal}>
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center mb-4">
                  <img src={excel} alt="Excel" className="h-8 w-8 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Upload Excel File</h3>
                </div>
                <div className="space-y-4">
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleExcelFile}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4 inline mr-2" />
                    Expected columns: Question, Marks
                  </div>
                  <button
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                    onClick={viewExample}>
                    <FileText className="w-4 h-4 mr-2" />
                    Download Example Format
                  </button>
                  {excelError && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                      {excelError}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form Content */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Title *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter assessment title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                      placeholder="Provide a detailed description of the assessment"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Publish Date & Time *</label>
                    <input
                      type="datetime-local"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={formData.publish_date_time}
                      onChange={(e) => setFormData({ ...formData, publish_date_time: e.target.value })}
                      required
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date & Time *</label>
                    <input
                      type="datetime-local"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={formData.due_date_time}
                      onChange={(e) => setFormData({ ...formData, due_date_time: e.target.value })}
                      required
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Marks (auto)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                      value={computedTotal}
                      readOnly
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Calculated from question marks</p>
                  </div>
                </div>
              </div>

              {/* Questions Section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Questions ({formData.questionItems.length})
                  </h3>
                  <button
                    type="button"
                    onClick={openExcelFormat}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center text-sm">
                    <img className="h-4 w-4 mr-2" src={excel} alt="excel" />
                    Import from Excel
                  </button>
                </div>

                <div className="space-y-6">
                  {formData.questionItems.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6">
                        <h4 className="text-lg font-medium text-gray-900 flex items-center mb-4 sm:mb-0">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mr-3">
                            Q{item.qno}
                          </span>
                          Question {item.qno}
                        </h4>
                        <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-3 sm:space-y-0 sm:space-x-4">
                          <div className="w-full sm:w-32">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Marks *</label>
                            <input
                              type="number"
                              min="1"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-center"
                              placeholder="10"
                              value={item.marks}
                              onChange={(e) => updateQuestionItem(index, "marks", e.target.value)}
                              required
                            />
                          </div>
                          {formData.questionItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeQuestionItem(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 mb-2 rounded-lg transition-colors self-end"
                              title="Remove question">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Question Text *</label>
                          <textarea
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                            rows="3"
                            placeholder="Enter your question here..."
                            value={item.question}
                            onChange={(e) => updateQuestionItem(index, "question", e.target.value)}
                            required
                          />
                        </div>

                        {type === "programming" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Starter Code (Optional)
                            </label>
                            <textarea
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono text-sm resize-none"
                              rows="4"
                              placeholder="// Write your starter code here..."
                              value={item.program_snippet}
                              onChange={(e) => updateQuestionItem(index, "program_snippet", e.target.value)}
                            />
                          </div>
                        )}

                        {type === "quiz" && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-3">Answer Options *</label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[0, 1, 2, 3].map((optIdx) => (
                                  <div key={optIdx} className="relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold z-10">
                                      {String.fromCharCode(65 + optIdx)}
                                    </div>
                                    <input
                                      type="text"
                                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                      placeholder={`Option ${optIdx + 1}`}
                                      value={item.options[optIdx]}
                                      onChange={(e) => {
                                        const newOptions = [...item.options];
                                        newOptions[optIdx] = e.target.value;
                                        updateQuestionItem(index, "options", newOptions);
                                      }}
                                      required
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer *</label>
                              <select
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                value={item.correct_ans}
                                onChange={(e) => updateQuestionItem(index, "correct_ans", e.target.value)}
                                required>
                                <option value="">Select the correct answer</option>
                                {item.options.map((option, optIdx) => (
                                  <option key={optIdx} value={option} disabled={!option.trim()}>
                                    {String.fromCharCode(65 + optIdx)}: {option || `Option ${optIdx + 1} (empty)`}
                                  </option>
                                ))}
                              </select>
                              <p className="text-xs text-gray-500 mt-2">
                                Select the correct option from the dropdown above
                              </p>
                            </div>
                          </div>
                        )}

                        {(type === "hr" || type === "technical") && (
                          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                            <label className="block text-sm font-medium text-gray-700 mb-4">Answer Format</label>
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:bg-white hover:border-blue-300 cursor-pointer transition-all duration-200 group">
                                  <input
                                    type="radio"
                                    name={`answer_type_${index}`}
                                    value="video"
                                    checked={item.answer_type === "video"}
                                    onChange={(e) => updateQuestionItem(index, "answer_type", e.target.value)}
                                    className="mr-3 text-blue-600 focus:ring-blue-500"
                                  />
                                  <div className="flex items-center">
                                    <Video className="w-5 h-5 mr-3 text-blue-600 group-hover:text-blue-700" />
                                    <div>
                                      <div className="font-medium text-gray-900 group-hover:text-gray-800">
                                        Video Answer
                                      </div>
                                      <div className="text-xs text-gray-500">Record or upload video response</div>
                                    </div>
                                  </div>
                                </label>
                                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:bg-white hover:border-green-300 cursor-pointer transition-all duration-200 group">
                                  <input
                                    type="radio"
                                    name={`answer_type_${index}`}
                                    value="transcript"
                                    checked={item.answer_type === "transcript"}
                                    onChange={(e) => updateQuestionItem(index, "answer_type", e.target.value)}
                                    className="mr-3 text-green-600 focus:ring-green-500"
                                  />
                                  <div className="flex items-center">
                                    <FileText className="w-5 h-5 mr-3 text-green-600 group-hover:text-green-700" />
                                    <div>
                                      <div className="font-medium text-gray-900 group-hover:text-gray-800">
                                        Text Answer
                                      </div>
                                      <div className="text-xs text-gray-500">Written or typed response</div>
                                    </div>
                                  </div>
                                </label>
                              </div>

                              {item.answer_type === "video" && (
                                <div className="space-y-6">
                                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                                    <h4 className="text-sm font-medium text-gray-700 mb-4">Record Sample Answer</h4>

                                    {/* Video Preview */}
                                    <div
                                      className="relative bg-gray-900 rounded-lg overflow-hidden mb-4"
                                      style={{ aspectRatio: "16/9" }}>
                                      <video
                                        ref={(el) => {
                                          if (!videoRefs.current) videoRefs.current = {};
                                          videoRefs.current[index] = el;
                                        }}
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        muted
                                        playsInline
                                      />
                                      {!recordingStates[index] && !item.recorded_video && (
                                        <div className="absolute inset-0 flex items-center justify-center text-white">
                                          <div className="text-center">
                                            <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm opacity-75">Click record to start</p>
                                          </div>
                                        </div>
                                      )}
                                      {recordingStates[index] === "recording" && (
                                        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                                          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                                          REC
                                        </div>
                                      )}
                                    </div>

                                    {/* Recording Controls */}
                                    <div className="flex flex-wrap gap-3">
                                      {(!recordingStates[index] || recordingStates[index] === "idle") && (
                                        <button
                                          type="button"
                                          onClick={() => startRecording(index)}
                                          className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium">
                                          <Play className="w-4 h-4 mr-2" />
                                          Start Recording
                                        </button>
                                      )}

                                      {recordingStates[index] === "recording" && (
                                        <button
                                          type="button"
                                          onClick={() => stopRecording(index)}
                                          className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium">
                                          <Square className="w-4 h-4 mr-2" />
                                          Stop Recording
                                        </button>
                                      )}

                                      {(recordingStates[index] === "stopped" || item.recorded_video) && (
                                        <button
                                          type="button"
                                          onClick={() => resetRecording(index)}
                                          className="flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm font-medium">
                                          <RotateCcw className="w-4 h-4 mr-2" />
                                          Reset
                                        </button>
                                      )}
                                    </div>

                                    {item.recorded_video && (
                                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-sm text-green-800 flex items-center">
                                          <span className="text-green-600 mr-2">✓</span>
                                          Sample answer recorded successfully
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                      Upload Video File (Optional)
                                    </label>
                                    <input
                                      type="file"
                                      accept="video/*"
                                      onChange={(e) => handleVideoFileSelect(index, e.target.files?.[0])}
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {uploadingVideo[index] && (
                                      <p className="text-xs text-blue-600 mt-2">Uploading video...</p>
                                    )}
                                    {item.answer_url && item.answer_url !== "NA" && (
                                      <p className="text-xs text-green-700 mt-2 break-all">
                                        Linked file: {item.answer_url}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}

                              {item.answer_type === "transcript" && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Sample Answer/Transcript (Optional)
                                  </label>
                                  <textarea
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                    rows="6"
                                    placeholder="Provide a sample answer or key points to look for..."
                                    value={item.answer_transcript === "NA" ? "" : item.answer_transcript}
                                    onChange={(e) =>
                                      updateQuestionItem(index, "answer_transcript", e.target.value || "NA")
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mt-8">
                  <button
                    type="button"
                    onClick={addQuestionItem}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-8 py-3 rounded-lg transition-colors flex items-center font-medium border border-blue-200 hover:border-blue-300">
                    <span className="text-xl mr-2">+</span>
                    Add Another Question
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
                {Object.values(uploadingVideo).some(Boolean) && (
                  <div className="w-full text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    One or more videos are uploading. Please wait...
                  </div>
                )}
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:w-auto px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium">
                  Clear Form
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/${type}`)}
                  className="w-full sm:w-auto px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || Object.values(uploadingVideo).some(Boolean)}
                  className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium min-w-[160px] flex items-center justify-center">
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Create Assessment"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateQuestion;
