import './App.css';
import Dashboard from './pages/Dashboard';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import VideoPage from './pages/VideoPage';
import Quiz from './pages/QuizPage';
import Hr from './pages/HrPage';
import Programming from './pages/ProgrammingPage';
import Tehnical from './pages/TehnicalPage';
import PrivateRoute from "./PrivateRoute";
import AutoLogin from "./AutoLogin.jsx";
import CreateQuiz from './components/CreateQuiz';
import EditQuiz from './components/EditQuiz';
import { useEffect } from 'react';
import CreateQuestion from './components/CreateQuestion.jsx';
import ViewAttempted from './pages/ViewAttempted.jsx';
import Answers from './components/Answers.jsx';


function App() {
 // const { state } = useData();
 const navigate = useNavigate();
 
 useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");

    if (!isLoggedIn || isLoggedIn !== "true") {
      console.warn("🔐 Not logged in, redirecting to login...");
      navigate("/signin"); // or your login route
      return;
    }

    //   console.log("🧠 User Session Data:");
    //   for (let i = 0; i < sessionStorage.length; i++) {
    //     const key = sessionStorage.key(i);
    //     const value = sessionStorage.getItem(key);
    //     console.log(`${key}: ${value}`);
    //   }
  }, [navigate]);
  return (
    <>
     <Routes>
  {/* ✅ Redirect "/" to "/dashboard" */}
  <Route path="/" element={<Navigate to="/dashboard" replace />} />

  {/* ✅ Dashboard layout with nested routes */}
  <Route path="/dashboard" element={<Dashboard />}>
    <Route index element={<VideoPage />} /> 
    <Route path='add-question/:type' element={<CreateQuestion/>}/>
    <Route path="quiz" element={<Quiz />} />
    <Route path="quiz/create" element={<CreateQuiz />} />
    <Route path="quiz/edit/:id" element={<EditQuiz />} />
    <Route path="hr" element={<Hr />} />
    <Route path="programming" element={<Programming />} />
    <Route path="technical" element={<Tehnical />} />
  </Route>
  <Route path="/answers/:type/:id" element={<ViewAttempted/>}/>
  <Route path="/answers/:type/:id/:userid" element={<Answers/>}/>
  {/* Signup / Signin routes */}
  <Route path="/signup" element={<Signup />} />
  <Route path="/signin" element={<Signin />} />
</Routes>

    </>
  );
}

export default App;
