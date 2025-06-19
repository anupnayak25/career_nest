import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useData } from './context/DataContext'

function App() {
  const {state}=useData();

  return (
    <><h1>hi</h1>
    <h1>{state}</h1>
    </>
  )
}

export default App
