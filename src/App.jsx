import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NewsTable from './components/NewsTable';
import NewsDetail from './components/NewsDetail';
import './App.css'; // Import the CSS file

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NewsTable />} />
        <Route path="/post/:id" element={<NewsDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
