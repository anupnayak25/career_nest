import "./App.css";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import VideoPlayer from "./pages/VideoPlayer"; // ✅ Add this import
import ProfilePage from "./pages/ProfilePage";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import DashboardHome from "./pages/Home";
import CreateQuestion from "./components/CreateQuestion";
import ViewAttempted from "./pages/ViewAttempted";
import Answers from "./components/Answers";
import Video from "./pages/Video"; // 👈 Fixed typo
import Loading from "./components/Loading";
import QuestionManagementPage from "./pages/QuestionManagementPage"; // Import the new component
import NavBar from "./components/NavBar"; // Add NavBar import
import { useEffect, useState } from "react";
import { checkServerHealth } from "./services/ApiService";
import { DataProvider } from "./context/DataContext";
import { ToastProvider } from "./ui/Toast";



function App() {
  const location = useLocation();
  const [serverUp, setServerUp] = useState(false);
  const [checking, setChecking] = useState(true);
  const [minimumLoadingTimePassed, setMinimumLoadingTimePassed] = useState(true);

  // Pages that should NOT show the navbar
  const excludedPaths = ["/dashboard", "/signup", "/signin", "/"];
  const shouldShowNavBar = !excludedPaths.some(
    (path) => location.pathname === path || location.pathname.startsWith("/dashboard")
  );

  useEffect(() => {
    let intervalId;
    const check = async () => {
      const up = await checkServerHealth();
      setServerUp(up);
      setChecking(false);
      if (!up) {
        intervalId = setTimeout(check, 3000);
      }
    };
    check();
    return () => {
      if (intervalId) {
        clearTimeout(intervalId);
      }
    };
  }, []);

  if (checking || !serverUp || !minimumLoadingTimePassed) {
    return <Loading />;
  }

  return (
    <ToastProvider>
      <DataProvider>
        {shouldShowNavBar && <NavBar />}
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="video" element={<Video />} />
            <Route path=":type" element={<QuestionManagementPage />} /> {/* Dynamic route for question management */}
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="/add-question/:type" element={<CreateQuestion />} />
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
