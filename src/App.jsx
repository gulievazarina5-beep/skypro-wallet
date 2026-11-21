import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./Auth";
import Main from "./pages/Main/Main";
import Analytics from "./pages/Analytics/Analytics";


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/auth" replace />;
};


const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/main" replace /> : children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/main" replace />} />
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />
        <Route
          path="/main"
          element={
            <PrivateRoute>
              <Main />
            </PrivateRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <PrivateRoute>
              <Analytics />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/main" replace />} />
      </Routes>
    </Router>
  );
}
