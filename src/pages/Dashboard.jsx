import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import './Dashboard.css';

function Dashboard({ user }) {
  const { language, t } = useLanguage();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const hasProfile = user?.profile && user?.profile?.age && user?.profile?.income;

  useEffect(() => {
    if (hasProfile) {
      setLoading(true);
      setError('');
      api.checkEligibility({
        age: user.profile.age,
        income: user.profile.income,
        category: user.profile.category,
        state: user.profile.state,
        gender: user.profile.gender
      })
        .then(res => {
          if (res.data && res.data.schemes) {
            setSchemes(res.data.schemes);
          }
        })
        .catch(err => {
          console.error('Failed to load matching schemes:', err);
          setError(language === 'hi' ? 'वास्तविक समय की सिफारिशें लाने में विफल।' : 'Failed to fetch real-time recommendations.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user, language]);

  // Statistics calculation
  const matchedCount = hasProfile ? schemes.length : 12;
  const appliedCount = user?.applications?.length || 2;
  const approvedCount = user?.applications?.filter(a => a.status === 'approved').length || 1;

  // Vault Status
  const documents = [
    { 
      name: language === 'hi' ? 'आधार कार्ड' : 'Aadhaar Card', 
      status: hasProfile ? (language === 'hi' ? 'ओसीआर द्वारा सत्यापित' : 'Verified via OCR') : (language === 'hi' ? 'अपलोड लंबित' : 'Pending Upload'), 
      verified: hasProfile, 
      icon: '🪪' 
    },
    { 
      name: language === 'hi' ? 'आय प्रमाण पत्र' : 'Income Certificate', 
      status: language === 'hi' ? 'अपलोड लंबित' : 'Pending Upload', 
      verified: false, 
      icon: '📄' 
    },
    { 
      name: language === 'hi' ? 'जाति प्रमाण पत्र' : 'Caste Certificate', 
      status: language === 'hi' ? 'अपलोड लंबित' : 'Pending Upload', 
      verified: false, 
      icon: '🏛️' 
    }
  ];

  // Active Applications Tracker
  const activeApplications = [
    { 
      name: 'PM Kisan Samman Nidhi', 
      status: language === 'hi' ? 'स्वीकृत' : 'Approved', 
      date: '2026-07-09', 
      statusColor: 'success', 
      progress: 100 
    },
    { 
      name: 'Ayushman Bharat', 
      status: language === 'hi' ? 'समीक्षाधीन' : 'Under Review', 
      date: '2026-07-10', 
      statusColor: 'warning', 
      progress: 60 
    }
  ];

  return (
    <div className="dashboard-page page-container">
      <div className="bg-gradient-dashboard"></div>
      
      <div className="container">
        {/* Dashboard Header */}
        <div className="dashboard-header fade-in">
          <div>
            <h1 className="dashboard-title">{t('dash_welcome')}, {user?.name || (language === 'hi' ? 'नागरिक' : 'Citizen')}! 👋</h1>
            <p className="dashboard-subtitle">{t('dash_subtitle')}</p>
          </div>
          <Link to="/check-eligibility" className="btn btn-primary btn-check-schemes">
            {t('dash_check_new')}
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M7 3L14 10L7 17" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="stats-grid slide-in-top">
          <div className="stat-card primary">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-value">{matchedCount}</div>
              <div className="stat-label">{t('dash_stat_matched')}</div>
            </div>
          </div>
          
          <div className="stat-card secondary">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-value">{appliedCount}</div>
              <div className="stat-label">{t('dash_stat_applied')}</div>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{approvedCount}</div>
              <div className="stat-label">{t('dash_stat_approved')}</div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Layout */}
        <div className="dashboard-grid">
          
          {/* Left Panel: Profile and Schemes */}
          <div className="dashboard-left-panel">
            
            {/* Citizen Digital ID Card */}
            <div className="citizen-id-section">
              <h2 className="section-title">{t('dash_profile_title')}</h2>
              <div className="citizen-card-container">
                <div className="citizen-id-card">
                  <div className="card-mesh"></div>
                  <div className="card-header">
                    <div className="emblem-placeholder">
                      <div className="emblem-circle"></div>
                      <span>GOI</span>
                    </div>
                    <div className="header-text">
                      <h3>{t('dash_profile_card_header')}</h3>
                      <p>{t('dash_profile_card_sub')}</p>
                    </div>
                    <div className="card-chip"></div>
                  </div>
                  
                  <div className="card-body">
                    <div className="user-avatar-section">
                      <div className="user-avatar-circle">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <span className="status-verified-badge">✓ {language === 'hi' ? 'सत्यापित' : 'Verified'}</span>
                    </div>
                    
                    <div className="user-details-grid">
                      <div className="detail-item">
                        <span className="card-lbl">{t('dash_profile_name')}</span>
                        <span className="card-val">{user?.name || (language === 'hi' ? 'नागरिक उपयोगकर्ता' : 'Citizen User')}</span>
                      </div>
                      <div className="detail-item">
                        <span className="card-lbl">{t('dash_profile_state')}</span>
                        <span className="card-val">{user?.profile?.state || (language === 'hi' ? 'प्रदान नहीं किया गया' : 'Not Provided')}</span>
                      </div>
                      <div className="detail-item">
                        <span className="card-lbl">{t('dash_profile_gender_age')}</span>
                        <span className="card-val">
                          {user?.profile?.gender || 'N/A'} • {user?.profile?.age ? `${user.profile.age} ${language === 'hi' ? 'वर्ष' : 'Yrs'}` : 'N/A'}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="card-lbl">{t('dash_profile_income')}</span>
                        <span className="card-val">
                          {user?.profile?.income ? `₹${user.profile.income.toLocaleString()}/${language === 'hi' ? 'वर्ष' : 'Yr'}` : (language === 'hi' ? 'प्रदान नहीं किया गया' : 'Not Provided')}
                        </span>
                      </div>
                      <div className="detail-item full-width">
                        <span className="card-lbl">{t('dash_profile_category')}</span>
                        <span className="card-val">{user?.profile?.category || (language === 'hi' ? 'प्रदान नहीं किया गया' : 'Not Provided')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-footer">
                    <span className="card-number">ID: JS-{(user?.id || '5109').substring(0, 8).toUpperCase()}</span>
                    <Link to="/check-eligibility" className="btn-edit-profile">
                      {t('dash_profile_update')} 📝
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Schemes Recommendation Section */}
            <div className="schemes-section">
              <div className="section-header">
                <h2 className="section-title">{t('dash_rec_title')}</h2>
                {hasProfile && schemes.length > 0 && (
                  <span className="match-badge">
                    {schemes.length} {language === 'hi' ? 'योजनाएं मिलीं' : 'Matches found'}
                  </span>
                )}
              </div>

              {loading ? (
                <div className="loading-state">
                  <span className="loading-spinner"></span>
                  <p>{language === 'hi' ? 'योग्य योजनाओं की खोज जारी है...' : 'Searching for eligible schemes...'}</p>
                </div>
              ) : error ? (
                <div className="error-state alert alert-error">
                  <span>{error}</span>
                </div>
              ) : hasProfile ? (
                schemes.length > 0 ? (
                  <div className="schemes-list">
                    {schemes.map((scheme, index) => (
                      <div key={index} className="scheme-card-interactive">
                        <div className="scheme-header">
                          <div>
                            <h3 className="scheme-name">{scheme.name}</h3>
                            <span className="scheme-category">{scheme.category}</span>
                          </div>
                          <div className="scheme-match-badge">
                            {scheme.matchScore}% Match
                          </div>
                        </div>

                        <p className="scheme-desc">{scheme.description}</p>

                        <div className="scheme-details">
                          <div className="scheme-detail">
                            <span className="detail-lbl">{language === 'hi' ? 'लाभ' : 'Benefits'}</span>
                            <span className="detail-val text-primary">{scheme.benefits}</span>
                          </div>
                          <div className="scheme-detail">
                            <span className="detail-lbl">{language === 'hi' ? 'अवधि' : 'Duration'}</span>
                            <span className="detail-val">{scheme.duration || (language === 'hi' ? 'सतत' : 'Ongoing')}</span>
                          </div>
                        </div>

                        <div className="scheme-actions">
                          {scheme.officialWebsite ? (
                            <a 
                              href={scheme.officialWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-primary btn-small"
                              style={{ textDecoration: 'none' }}
                            >
                              {t('res_apply_now')}
                            </a>
                          ) : (
                            <button className="btn btn-primary btn-small" disabled>{t('res_apply_now')}</button>
                          )}
                          <Link to="/check-eligibility" className="btn btn-outline btn-small">
                            {language === 'hi' ? 'विवरण पुनः सत्यापित करें' : 'Re-verify Details'}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-schemes-state">
                    <p>{language === 'hi' ? 'आपकी वर्तमान प्रोफ़ाइल के लिए कोई मिलान योजना नहीं मिली। विवरण अपडेट करने का प्रयास करें।' : 'No matching schemes found for your current profile. Try updating your details.'}</p>
                    <Link to="/check-eligibility" className="btn btn-secondary">{t('dash_profile_update')}</Link>
                  </div>
                )
              ) : (
                <div className="onboarding-cta-card">
                  <div className="cta-icon">💡</div>
                  <h3>{t('dash_onboarding_cta_title')}</h3>
                  <p>{t('dash_onboarding_cta_desc')}</p>
                  <Link to="/check-eligibility" className="btn btn-primary">{t('dash_onboarding_cta_btn')}</Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Documents and Tracking */}
          <div className="dashboard-right-panel">
            
            {/* Verified Document Vault Status */}
            <div className="vault-status-section">
              <h3 className="section-title">{t('dash_vault_title')}</h3>
              <div className="vault-list">
                {documents.map((doc, idx) => (
                  <div key={idx} className={`vault-item ${doc.verified ? 'verified' : 'pending'}`}>
                    <span className="vault-item-icon">{doc.icon}</span>
                    <div className="vault-item-info">
                      <span className="vault-doc-name">{doc.name}</span>
                      <span className="vault-doc-status">{doc.status}</span>
                    </div>
                    <span className="vault-status-indicator">
                      {doc.verified ? '✓' : '⚠'}
                    </span>
                  </div>
                ))}
              </div>
              <Link to="/upload-documents" className="vault-action-link">
                {t('dash_vault_action')} →
              </Link>
            </div>

            {/* Applications Progress Timeline */}
            <div className="application-tracking-section">
              <h3 className="section-title">{t('dash_app_title')}</h3>
              <div className="applications-timeline">
                {activeApplications.map((app, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-header">
                      <h4 className="app-name">{app.name}</h4>
                      <span className={`status-pill ${app.statusColor}`}>{app.status}</span>
                    </div>
                    <p className="app-date">{language === 'hi' ? 'जमा किया गया' : 'Submitted'}: {app.date}</p>
                    
                    <div className="progress-bar-container">
                      <div 
                        className={`progress-bar-fill ${app.statusColor}`} 
                        style={{ width: `${app.progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{app.progress}% {language === 'hi' ? 'पूर्ण' : 'Completed'}</span>
                  </div>
                ))}
              </div>
              <Link to="/track-applications" className="vault-action-link">
                {t('dash_app_action')} →
              </Link>
            </div>

            {/* Quick Helper Links */}
            <div className="quick-actions-section">
              <h3 className="section-title">{t('dash_support_title')}</h3>
              <div className="support-list">
                <Link to="/" className="support-card">
                  <span className="support-icon">💬</span>
                  <div>
                    <h4>{t('dash_support_chat')}</h4>
                    <p>{t('dash_support_desc')}</p>
                  </div>
                </Link>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;