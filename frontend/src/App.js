import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GuessingGame from './Components/GuessingGame';
import Home from './Components/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/guessingGame" element={<GuessingGame />} />
      </Routes>
    </Router>
  );
}

export default App;
