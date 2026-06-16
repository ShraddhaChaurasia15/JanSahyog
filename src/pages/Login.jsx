import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Auth.css';


function Login({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] =useState({
    email: '',
    password: ''
  });

  const [error, setError] =useState('');
  const [loading, setLoading] =useState(false);
  const handleChange = (e)=>{
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try{
      const response = await api.login(formData);
      onLogin(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-container">
      <div className="auth-container fade-in">
        <div className="auth-header">

            <h1 className="auth-title"> Welcome Back</h1>
           <p className="auth-subtitle">Sign in to access your dashboard</p>
        </div>
        {error &&(
          <div className="alert alert-error">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/>
              <path d="M10 6V10M10 14H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {error}
            </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              
              type="email"
              id="email"
              name="email"
              className="form-input"
             
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              
              name="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
             
              onChange={handleChange}
              required
            />
          </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                Sign In
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7 3L14 10L7 17" stroke="currentColor" strokeWidth="2" 
                        strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
            </button>
         </form>

          <div className="auth-footer">
          <p>Don't have an account? <Link to="/register" className="auth-link">Sign up</Link></p>
        </div>
        </div>
      </div>
  );
}



export default Login;