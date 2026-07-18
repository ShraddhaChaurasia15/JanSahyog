

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CheckEligibility from './pages/CheckEligibility';
import Results from './pages/Results';
import UploadDocuments from './pages/UploadDocuments';
import TrackApplications from './pages/TrackApplications';

//
import Navbar from './components/Navbar';
import './App.css';
import CategorySchemes from "./pages/CategorySchemes";


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    
    localStorage.removeItem('token');
    
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  return (
    <Router>
      <div className="App">
        {/* Navigation */}
        <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />

        <main className="main-content">
          <Routes>


            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onLogin={handleLogin} />} />
            <Route
  path="/schemes/:category"
  element={<CategorySchemes />}
/>

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard user={user} />
                </PrivateRoute>
              }
            />

            <Route
              path="/check-eligibility"
              element={
                <PrivateRoute>
                  <CheckEligibility />
                </PrivateRoute>
              }
            />

            <Route
              path="/results"
              element={
                <PrivateRoute>
                  <Results />
                </PrivateRoute>
              }
            />

            <Route
  path="/upload-documents"
  element={
    <PrivateRoute>
      <UploadDocuments />
    </PrivateRoute>
  }
/>

<Route
  path="/track-applications"
  element={
    <PrivateRoute>
      <TrackApplications />
    </PrivateRoute>
  }
/>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;