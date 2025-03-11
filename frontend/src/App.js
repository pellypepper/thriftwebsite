import React from 'react';
import './App.css';
import Home from './pages/home/home';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import User from './pages/user/user';

function App() {
  return (
    <Router>

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/user" element={<User />} />
    </Routes>
  </Router>
  );
}

export default App;
