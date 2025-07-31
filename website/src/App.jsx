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
import { checkServerHealth } from "./services/ApiService";
import { DataProvider } from "./context/DataContext";
import { ToastProvider } from "./ui/Toast";

function App() {
  const [serverUp, setServerUp] = useState(false);
  const [checking, setChecking] = useState(true);
 // const [minimumLoadingTimePassed, setMinimumLoadingTimePassed] = useState(false);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setMinimumLoadingTimePassed(true);
  //   }, 15000); // 30 seconds

  //   return () => clearTimeout(timer);
  // }, []);

  useEffect(() => {
    let intervalId;
    const check = async () => {
      console.log("[App] Checking server health...");
      const up = await checkServerHealth();
      console.log(`[App] Server health check result: ${up}`);
      setServerUp(up);
      console.log(`[App] Updated serverUp state: ${up}`);
      setChecking(false);
      console.log("[App] Updated checking state: false");
      if (!up) {
        console.log("[App] Server is down, retrying in 3 seconds...");
        intervalId = setTimeout(check, 3000);
      } else {
        console.log("[App] Server is up, stopping health checks.");
      }
    };
    check();
    return () => {
      if (intervalId) {
        console.log("[App] Clearing health check interval.");
        clearTimeout(intervalId);
      }
    };
  }, []);

  if (checking || !serverUp ) { //|| !minimumLoadingTimePassed
    return <Loading />;
  }

  return (
    <ToastProvider>
      <DataProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />}>
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
