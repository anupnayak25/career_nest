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

function App() {
  const { state } = useData();

  return (
    <>
      <Routes>
        <Route path='/' element={<Dashboard />}>
          <Route index element={<VideoPage />} /> 
          <Route path='/dashboard/quiz' element={<Quiz />} />
          <Route path='/dashboard/hr' element={<Hr />} />
          <Route path='/dashboard/programming' element={<Programming />} />
          <Route path='/dashboard/technical' element={<Tehnical />} />
        </Route>
        
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
      </Routes>
    </>
  );
}

export default App;
