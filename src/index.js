import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import Home from './pages/Home';
import Puzzle from './pages/Puzzle';
import Layout from './pages/Layout';
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function TheApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="puzzle" element={<Puzzle />} />
          <Route path="puzzle/:id" element={<Puzzle />} />
          <Route path="*" element={<Home />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<TheApp />);