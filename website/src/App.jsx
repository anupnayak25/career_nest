import './App.css';
import Dashboard from './pages/Dashboard';
import { Navigate, Route, Routes } from 'react-router-dom';
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


function App() {
 // const { state } = useData();
 

  return (
    <>
     <Routes>
  {/* ✅ Redirect "/" to "/dashboard" */}
  <Route path="/" element={<Navigate to="/dashboard" replace />} />

  {/* ✅ Dashboard layout with nested routes */}
  <Route path="/dashboard" element={<Dashboard />}>
    <Route index element={<VideoPage />} /> 
    <Route path="quiz" element={<Quiz />} />
    <Route path="quiz/create" element={<CreateQuiz />} />
    <Route path="quiz/edit/:id" element={<EditQuiz />} />
    <Route path="hr" element={<Hr />} />
    <Route path="programming" element={<Programming />} />
    <Route path="technical" element={<Tehnical />} />
  </Route>

  {/* Signup / Signin routes */}
  <Route path="/signup" element={<Signup />} />
  <Route path="/signin" element={<Signin />} />
</Routes>

    </>
  );
}

export default App;
