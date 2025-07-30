import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";

// Pages and Components
import Dashboard from "./pages/Dashboard";
import VideoPlayer from "./pages/VideoPlayer"; // ✅ Add this import

import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import DashboardHome from "./pages/DashboardHome"; // ✅ New dashboard home
import Quiz from "./pages/QuizPage";
import Hr from "./pages/HrPage";
import Programming from "./pages/ProgrammingPage";
import Tehnical from "./pages/TehnicalPage";
import EditQuiz from "./components/EditQuiz";
import CreateQuestion from "./components/CreateQuestion";
import ViewAttempted from "./pages/ViewAttempted";
import Answers from "./components/Answers";
import Video from "./pages/Video"; // 👈 Fixed typo
import Loading from "./components/Loading";

import { useEffect, useState } from "react";
import { DataProvider } from "./context/DataContext";
import { ToastProvider } from "./ui/Toast";

function App() {
  const [serverUp, setServerUp] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        // Change the URL to your backend server's health endpoint
        const res = await fetch("/" , {
          method: "GET",
        });
        if (res.status === 200) {
          setServerUp(true);
        } else {
          setServerUp(false);
        }
      } catch (e) {
        setServerUp(false);
      } finally {
        setChecking(false);
      }
    };
    checkServerStatus();
  }, []);

  if (checking || !serverUp) {
    return <Loading />;
  }

  return (
    <ToastProvider>
      <DataProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Loading />}>
            <Route index element={<DashboardHome />} />
            <Route path="quiz" element={<Quiz />} />
            {/* // <Route path="quiz/create" element={<CreateQuiz />} /> */}
            <Route path="quiz/edit/:id" element={<EditQuiz />} />
            <Route path="hr" element={<Hr />} />
            <Route path="programming" element={<Programming />} />
            <Route path="technical" element={<Tehnical />} />
            <Route path="video" element={<Video />} /> {/* ✅ Fixed typo */}
            <Route path="vedio" element={<Video />} /> {/* ✅ Backward compatibility */}
            <Route path="add-question/:type" element={<CreateQuestion />} />
          </Route>

          {/* Answers and Attempts */}
          <Route path="/answers/:type/:id" element={<ViewAttempted />} />
          <Route path="/answers/:type/:id/:userid" element={<Answers />} />

          {/* Auth */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
          <Route path="/video-player/:id" element={<VideoPlayer />} />
        </Routes>
      </DataProvider>
    </ToastProvider>
  );
}

export default App;
