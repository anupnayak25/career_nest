// ViewAttempted.jsx - Enhanced UI with table layout
import React, { useEffect, useState } from "react";
import { evaluate, getSubmittedUsers, getAnalysisStatus } from "../services/ApiService";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import StudentCard from "../components/StudentCard";
import * as XLSX from "xlsx";

function ViewAttempted() {
  const navigate = useNavigate();
  const { type, id } = useParams(); // type = quiz/hr/etc, id = question id
  const { attemptedData, setAttemptedData } = useData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysisStatus, setAnalysisStatus] = useState("not_analysed");
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    const fetchAttemptedData = async () => {
      try {
        setLoading(true);
        setError("");
        const users = await getSubmittedUsers(type, id);
        if (users && users.message === "No answers yet") {
          setAttemptedData((prev) => ({
            ...prev,
            [`${type}_${id}`]: [],
          }));
        } else {
          setAttemptedData((prev) => ({
            ...prev,
            [`${type}_${id}`]: users.users,
          }));
        }
      } catch (err) {
        // If 404 or "No answers yet", show a friendly message instead of error
        if (err.message && (err.message.includes("404") || err.message.includes("No answers yet"))) {
          setAttemptedData((prev) => ({
            ...prev,
            [`${type}_${id}`]: [],
          }));
          setError("");
        } else {
          setError("Failed to load attempted data");
        }
        console.error("Failed to load attempted data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttemptedData();
  }, [type, id, setAttemptedData]);

  const data = attemptedData[`${type}_${id}`];

  // Initial status fetch on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getAnalysisStatus(id, type);
        if (mounted && res && res.success) setAnalysisStatus(res.status);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, type]);

  // Poll analysis status if undergoing
  useEffect(() => {
    let interval;
    const fetchStatus = async () => {
      try {
        const res = await getAnalysisStatus(id, type);
        if (res && res.success) {
          setAnalysisStatus(res.status);
          if (res.status === "completed") {
            setPolling(false);
            clearInterval(interval);
          }
        }
      } catch {
        // silent fail
      }
    };
    if (polling) {
      fetchStatus(); // immediate
      interval = setInterval(fetchStatus, 3000);
    }
    return () => interval && clearInterval(interval);
  }, [polling, id, type]);

  const triggerEvaluate = async () => {
    setPolling(true);
    setAnalysisStatus("undergoing");
    await evaluate(id, type);
    // evaluation route will eventually set completed; polling loop will capture it
  };

  const handleViewAnswers = (userId) => {
    navigate(`/answers/${type}/${id}/${userId}`);
  };

  const downloadExcel = () => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      alert("No data available to download");
      return;
    }

    // Prepare data for Excel
    const excelData = data.map((user, index) => ({
      "Sr. No.": index + 1,
      "Student Name": user.name || "N/A",
      Email: user.email_id || "N/A",
      "Submitted At": user.submittedAt ? new Date(user.submittedAt).toLocaleString() : "N/A",
      Status: user.status || "Submitted",
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const columnWidths = [
      { wch: 8 }, // Sr. No.
      { wch: 20 }, // Student Name
      { wch: 25 }, // Email
      { wch: 20 }, // Submitted At
      { wch: 12 }, // Status
    ];
    worksheet["!cols"] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attempted Students");

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    const filename = `${type}_${id}_attempted_students_${timestamp}.xlsx`;

    // Download the file
    XLSX.writeFile(workbook, filename);
  };

  return (
    <div className="max-w-full mx-auto bg-white rounded-xl shadow-lg px-4 mt-8 animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-3 animate-slide-up">
              <span role="img" aria-label="students">
                👨‍🎓
              </span>
              Attempted Students
            </h1>
            <p className="text-gray-600 mt-2">
              {type?.toUpperCase()} ID: {id}
            </p>
          </div>
          {!loading && !error && data && Array.isArray(data) && data.length > 0 && (
            <button
              onClick={downloadExcel}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download Excel
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12 animate-fade-in">
          <div className="flex items-center gap-3 text-blue-600">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-lg font-medium">Loading students...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-fade-in">
          <div className="flex items-center gap-2 text-red-700">
            <span role="img" aria-label="error">
              ⚠️
            </span>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {!data || !Array.isArray(data) || data.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl py-16 text-center animate-fade-in">
              <div className="text-gray-400">
                <span role="img" aria-label="no attempts" className="text-6xl block mb-4">
                  🕵️‍♂️
                </span>
                <h3 className="text-xl font-semibold mb-2">No Attempts Yet</h3>
                <p className="text-gray-500">Students haven't started attempting this {type} yet.</p>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="mb-6 flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 text-white rounded-full p-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-blue-800 font-semibold text-lg">
                      {data.length} {data.length === 1 ? "Student" : "Students"} Attempted
                    </p>
                    <p className="text-blue-600 text-sm">{type?.toUpperCase()} Assessment Results</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 text-blue-600">
                  {(type === "technical" || type === "hr") && (
                    <button
                      onClick={triggerEvaluate}
                      disabled={analysisStatus === "undergoing"}
                      className={`p-2 px-5 text-sm rounded-lg transition-colors ${
                        analysisStatus === "undergoing"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-800 hover:bg-blue-900 text-white"
                      }`}>
                      {analysisStatus === "undergoing"
                        ? "Analysing..."
                        : analysisStatus === "completed"
                        ? "Re-Analyse"
                        : "Auto Analyse"}
                    </button>
                  )}
                  <div className="text-xs font-medium text-blue-700 flex items-center gap-1">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        analysisStatus === "completed"
                          ? "bg-green-500"
                          : analysisStatus === "undergoing"
                          ? "bg-yellow-500 animate-pulse"
                          : "bg-gray-400"
                      }`}></span>
                    Status: {analysisStatus.replace("_", " ")}
                  </div>
                </div>
              </div>
              <StudentCard users={data} onViewAnswers={handleViewAnswers} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ViewAttempted;
