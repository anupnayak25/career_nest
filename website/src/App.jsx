import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";

// Pages and Components
import Dashboard from "./pages/Dashboard";
import VideoPlayer from "./pages/VideoPlayer"; // ✅ Add this import

import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import VideoPage from "./pages/VideoPage";
import Quiz from "./pages/QuizPage";
import Hr from "./pages/HrPage";
import Programming from "./pages/ProgrammingPage";
import Tehnical from "./pages/TehnicalPage";
import CreateQuiz from "./components/CreateQuiz";
import EditQuiz from "./components/EditQuiz";
import CreateQuestion from "./components/CreateQuestion";
import ViewAttempted from "./pages/ViewAttempted";
import Answers from "./components/Answers";
import Video from "./pages/Video"; // 👈 Fixed typo
import { DataProvider } from "./context/DataContext";
import { ToastProvider } from "./ui/Toast";

function App() {
  return (
    <ToastProvider>
      <DataProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<VideoPage />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="quiz/create" element={<CreateQuiz />} />
            <Route path="quiz/edit/:id" element={<EditQuiz />} />
            <Route path="hr" element={<Hr />} />
            <Route path="programming" element={<Programming />} />
            <Route path="technical" element={<Tehnical />} />
            <Route path="video" element={<Video />} /> {/* ✅ Fixed typo */}
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
