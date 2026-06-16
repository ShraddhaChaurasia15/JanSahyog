import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './CheckEligibility.css';

function CheckEligibility() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: '',
    income: '',
    category: '',
    state: '',
    gender: ''
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const categories = ['General', 'OBC', 'SC', 'ST', 'EWS'];
  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }
      setFile(droppedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.checkEligibility({
        ...formData,
        age: parseInt(formData.age),
        income: parseFloat(formData.income)
      });

      navigate('/results', { state: { schemes: response.data.schemes } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check eligibility. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="eligibility-page">
      {/* Animated Background */}
      <div className="bg-gradient"></div>
      
      <div className="container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Instant Eligibility Check
          </div>
          <h1 className="hero-title">
            Discover Your <span className="gradient-text">Eligible Schemes</span>
          </h1>
          <p className="hero-subtitle">
            Answer a few questions and we'll match you with government welfare programs tailored to your needs
          </p>
        </div>

        <div className="content-grid">
          {/* Info Cards */}
          <div className="info-sidebar">
            <div className="info-card">
              <div className="info-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Simple Process</h3>
              <p>Fill the form once and get matched with all eligible schemes instantly</p>
            </div>

            <div className="info-card">
              <div className="info-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="16" r="1" fill="currentColor"/>
                </svg>
              </div>
              <h3>100% Secure</h3>
              <p>Your personal data is encrypted and never shared with third parties</p>
            </div>

            <div className="info-card">
              <div className="info-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Real-time Results</h3>
              <p>Get instant matches based on the latest scheme database</p>
            </div>
          </div>

          {/* Form Panel */}
          <div className="form-panel">
            <div className="form-card">
              {error && (
                <div className="alert alert-error">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/>
                    <path d="M10 6V10M10 14H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="modern-form">
                {/* Personal Information Section */}
                <div className="form-section">
                  <h3 className="section-title">Personal Information</h3>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="age" className="form-label">
                        <span>Age</span>
                        <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <input
                          type="number"
                          id="age"
                          name="age"
                          className="form-input"
                          placeholder="Enter your age"
                          value={formData.age}
                          onChange={handleChange}
                          required
                          min="1"
                          max="120"
                        />
                        <span className="input-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="gender" className="form-label">
                        <span>Gender</span>
                        <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <select
                          id="gender"
                          name="gender"
                          className="form-input"
                          value={formData.gender}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <span className="input-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="income" className="form-label">
                      <span>Annual Household Income</span>
                      <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="number"
                        id="income"
                        name="income"
                        className="form-input input-with-prefix"
                        placeholder="0"
                        value={formData.income}
                        onChange={handleChange}
                        required
                        min="0"
                        step="1000"
                      />
                      <span className="input-prefix">₹</span>
                    </div>
                    <p className="form-hint">Enter your total annual household income in rupees</p>
                  </div>
                </div>

                {/* Category & Location Section */}
                <div className="form-section">
                  <h3 className="section-title">Category & Location</h3>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="category" className="form-label">
                        <span>Category</span>
                        <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <select
                          id="category"
                          name="category"
                          className="form-input"
                          value={formData.category}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select category</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <span className="input-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                            <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="state" className="form-label">
                        <span>State</span>
                        <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <select
                          id="state"
                          name="state"
                          className="form-input"
                          value={formData.state}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select state</option>
                          {states.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                        <span className="input-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document Upload Section */}
                <div className="form-section">
                  <h3 className="section-title">Supporting Documents (Optional)</h3>
                  
                  <div className="form-group">
                    <div 
                      className={`file-upload-area ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        id="document"
                        className="file-input-hidden"
                        onChange={handleFileChange}
                        accept="image/*,.pdf"
                      />
                      <label htmlFor="document" className="file-upload-label">
                        {file ? (
                          <div className="file-selected">
                            <div className="file-icon">
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M13 2V9H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <div className="file-info">
                              <p className="file-name">{file.name}</p>
                              <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                            <button 
                              type="button" 
                              className="file-remove"
                              onClick={(e) => {
                                e.preventDefault();
                                setFile(null);
                              }}
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <div className="file-upload-content">
                            <div className="upload-icon">
                              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <p className="upload-text">
                              <span className="upload-primary">Click to upload</span> or drag and drop
                            </p>
                            <p className="upload-hint">PDF, JPG, PNG (max 5MB)</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      <span>Analyzing Eligibility...</span>
                    </>
                  ) : (
                    <>
                      <span>Check Eligibility</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckEligibility;