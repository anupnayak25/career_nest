import { useState } from 'react';
import './App.css';
import { useData } from './context/DataContext';
import Dashboard from './pages/Dashboard';
import { Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import VideoPage from './pages/VideoPage';
import Quiz from './pages/QuizPage';
import Hr from './pages/HrPage';
import Programming from './pages/ProgrammingPage';
import Tehnical from './pages/TehnicalPage';
import CreateQuiz from './pages/CreateQuiz.jsx';
import EditQuiz from './pages/EditQuiz.jsx';
import PrivateRoute from "./PrivateRoute";
import AutoLogin from "./AutoLogin.jsx";


function App() {
 // const { state } = useData();
 

  return (
    <>
      <Routes>
        <Route path='/' element={<Dashboard />}>
          <Route index element={<VideoPage />} /> 
          <Route path='/dashboard/quiz' element={<Quiz />} />
          <Route path="/dashboard/quiz/create" element={<CreateQuiz />} />
          <Route path='/dashboard/hr' element={<Hr />} />
          <Route path='/dashboard/programming' element={<Programming />} />
          <Route path='/dashboard/technical' element={<Tehnical />} />
          <Route path="/dashboard/quiz/edit/:id" element={<EditQuiz />} />
        </Route>
        
        {/* <Route element={<AutoLogin />}> */}

        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
        {/* </Route> */}
      </Routes>
    </>
  );
}

export default App;
