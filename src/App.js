import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Navbar from "./pages/Navbar";
import RequestsPage from "./pages/RequestsPage";
import ProjectsPage from "./pages/ProjectsPage";

function AppLayout() {
  return (
    <div className="admin-shell">
      <Navbar />
      <div className="admin-main">
        <Routes>
          <Route path="/" element={<Navigate to="/requests" replace />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;