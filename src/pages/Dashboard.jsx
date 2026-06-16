import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard({ user }) {
  const quickStats = [
    {
      icon: '🎯',
      label: 'Schemes Matched',
      value: '12',
      color: 'primary'
    },
    {
      icon: '📋',
      label: 'Applications',
      value: '5',
      color: 'secondary'
    },
    {
      icon: '✅',
      label: 'Approved',
      value: '3',
      color: 'success'
    }
  ];

  const recentSchemes = [
    {
      name: 'PM Kisan Samman Nidhi',
      category: 'Agriculture',
      amount: '₹6,000/year',
      status: 'Eligible',
      deadline: '2026-03-31'
    },
    {
      name: 'Ayushman Bharat',
      category: 'Healthcare',
      amount: '₹5 Lakh/year',
      status: 'Applied',
      deadline: 'No deadline'
    },
    {
      name: 'Pradhan Mantri Awas Yojana',
      category: 'Housing',
      amount: '₹2.5 Lakh',
      status: 'Eligible',
      deadline: '2026-06-30'
    }
  ];

  return (
    <div className="dashboard-page page-container">
      <div className="container">

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Welcome back, {user?.name}! 👋</h1>
            <p className="dashboard-subtitle">Here's an overview of your welfare schemes</p>
          </div>
          <Link to="/check-eligibility" className="btn btn-primary">
            Check New Schemes
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M7 3L14 10L7 17" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className="stats-grid">
          {quickStats.map((stat, index) => (
            <div key={index} className={`stat-card ${stat.color}`}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-content">

          <div className="schemes-section">
            <div className="section-header">
              <h2 className="section-title">Your Eligible Schemes</h2>
              <Link to="/check-eligibility" className="section-link">
                View All
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            <div className="schemes-list">
              {recentSchemes.map((scheme, index) => (
                <div key={index} className="scheme-card">
                  <div className="scheme-header">
                    <div>
                      <h3 className="scheme-name">{scheme.name}</h3>
                      <span className="scheme-category">{scheme.category}</span>
                    </div>
                    <span className={`scheme-status ${scheme.status.toLowerCase()}`}>
                      {scheme.status}
                    </span>
                  </div>

                  <div className="scheme-details">
                    <div className="scheme-detail">
                      <span className="detail-label">Benefit Amount</span>
                      <span className="detail-value">{scheme.amount}</span>
                    </div>
                    <div className="scheme-detail">
                      <span className="detail-label">Deadline</span>
                      <span className="detail-value">{scheme.deadline}</span>
                    </div>
                  </div>

                  <button className="btn btn-outline btn-small">View Details</button>
                </div>
              ))}
            </div>
          </div>

          <div className="quick-actions">
            <div className="section-header">
              <h3 className="section-title">Quick Actions</h3>
            </div>

            <div className="actions-list">
              <Link to="/check-eligibility" className="action-card">
                <div className="action-icon">🔍</div>
                <div className="action-content">
                  <h4 className="action-title">Check Eligibility</h4>
                  <p className="action-description">Find new schemes you qualify for</p>
                </div>
              </Link>

             <Link to="/upload-documents" className="action-card">
  <div className="action-icon">📄</div>
  <div className="action-content">
    <h4 className="action-title">Upload Documents</h4>
    <p className="action-description">
      Add supporting documents
    </p>
  </div>
</Link>

             <Link to="/track-applications" className="action-card">
  <div className="action-icon">📊</div>
  <div className="action-content">
    <h4 className="action-title">Track Applications</h4>
    <p className="action-description">
      Monitor application status
    </p>
  </div>
</Link>
 </div>
</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;