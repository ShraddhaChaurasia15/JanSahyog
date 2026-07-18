import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Results.css';

function Results() {
  const location = useLocation();
  const schemes = location.state?.schemes || [];
  const { language, t } = useLanguage();

  if (schemes.length === 0) {
    return (
      <div className="results-page page-container">
        <div className="container">
          <div className="empty-state fade-in">
            <div className="empty-icon">🔍</div>
            <h2 className="empty-title">{language === 'hi' ? 'कोई परिणाम नहीं मिला' : 'No Results Found'}</h2>
            <p className="empty-description">
              {language === 'hi' 
                ? 'हमें आपके मानदंडों से मेल खाती कोई योजना नहीं मिली। अपने विवरण को समायोजित करने का प्रयास करें या नई योजनाओं के लिए बाद में देखें।' 
                : "We couldn't find any schemes matching your criteria. Try adjusting your details or check back later for new schemes."}
            </p>
            <Link to="/check-eligibility" className="btn btn-primary">
              {language === 'hi' ? 'पुनः जांचें' : 'Check Again'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="results-page page-container">
      <div className="container">
        <div className="results-header fade-in">
          <div>
            <h1 className="page-title">{language === 'hi' ? 'आपकी योग्य योजनाएं' : 'Your Eligible Schemes'}</h1>
            <p className="page-subtitle">
              {language === 'hi' 
                ? `हमें ${schemes.length} योजनाएं मिलीं जिनके लिए आप पात्र हैं` 
                : `We found ${schemes.length} scheme${schemes.length !== 1 ? 's' : ''} you're eligible for`}
            </p>
          </div>
          <Link to="/check-eligibility" className="btn btn-outline">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M14 7L10 3L6 7" stroke="currentColor" strokeWidth="2" 
                    strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 3V13" stroke="currentColor" strokeWidth="2" 
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {language === 'hi' ? 'पुनः जांचें' : 'Check Again'}
          </Link>
        </div>

        {/* Success Banner */}
        <div className="success-banner slide-in-left">
          <div className="banner-icon">🎉</div>
          <div className="banner-content">
            <h3 className="banner-title">{language === 'hi' ? 'बधाई हो!' : 'Great News!'}</h3>
            <p className="banner-text">
              {language === 'hi' 
                ? 'आप कई कल्याणकारी योजनाओं के लिए योग्य हैं। नीचे दिए गए विवरणों की समीक्षा करें और जो आपके लिए सबसे उपयुक्त हैं उनके लिए आवेदन करें।' 
                : 'You qualify for multiple welfare schemes. Review the details below and apply for the ones that suit you best.'}
            </p>
          </div>
        </div>

        {/* Schemes Grid */}
        <div className="results-grid">
          {schemes.map((scheme, index) => (
            <div 
              key={index} 
              className="result-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="result-header">
                <div className="result-badge">{scheme.category || 'General'}</div>
                <div className="match-ring-wrapper">
                  <svg className="match-ring" width="40" height="40">
                    <circle className="match-ring-bg" cx="20" cy="20" r="16" strokeWidth="3" />
                    <circle 
                      className="match-ring-fill" 
                      cx="20" 
                      cy="20" 
                      r="16" 
                      strokeWidth="3"
                      strokeDasharray={2 * Math.PI * 16}
                      strokeDashoffset={2 * Math.PI * 16 * (1 - (scheme.matchScore || 95) / 100)}
                    />
                  </svg>
                  <span className="match-ring-text">{scheme.matchScore || 95}%</span>
                </div>
              </div>

              <h3 className="result-title">{scheme.name}</h3>
              <p className="result-description">{scheme.description}</p>

              <div className="result-benefits">
                <div className="benefit-item">
                  <span className="benefit-icon">💰</span>
                  <div>
                    <div className="benefit-label">{language === 'hi' ? 'लाभ राशि' : 'Benefit Amount'}</div>
                    <div className="benefit-value">{scheme.benefits || (language === 'hi' ? 'योजना के अनुसार' : 'As per scheme')}</div>
                  </div>
                </div>
                
                {scheme.duration && (
                  <div className="benefit-item">
                    <span className="benefit-icon">⏱️</span>
                    <div>
                      <div className="benefit-label">{language === 'hi' ? 'अवधि' : 'Duration'}</div>
                      <div className="benefit-value">{scheme.duration}</div>
                    </div>
                  </div>
                )}
              </div>

              {scheme.eligibilityReason && (
                <div className="result-reason">
                  <div className="reason-header">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1L10.5 6L16 6.5L12 10.5L13 16L8 13L3 16L4 10.5L0 6.5L5.5 6L8 1Z" 
                            fill="currentColor"/>
                    </svg>
                    {t('res_why_eligible')}
                  </div>
                  <p>{scheme.eligibilityReason}</p>
                </div>
              )}

              <div className="result-actions">
                {scheme.officialWebsite ? (
                  <a 
                    href={scheme.officialWebsite} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-primary btn-full"
                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    {t('res_apply_now')}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" 
                            strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                ) : (
                  <button className="btn btn-primary btn-full" disabled>
                    {t('res_apply_now')}
                  </button>
                )}
                {scheme.officialWebsite ? (
                  <a 
                    href={scheme.officialWebsite} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-outline btn-full"
                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {t('res_view_details')}
                  </a>
                ) : (
                  <button className="btn btn-outline btn-full" disabled>
                    {t('res_view_details')}
                  </button>
                )}
              </div>

              {scheme.requirements && (
                <details className="result-details" open>
                  <summary>{t('res_checklist_title')}</summary>
                  <ul className="requirements-list" style={{ listStyle: 'none', paddingLeft: 0, marginTop: '12px' }}>
                    {/* Render uploaded & verified documents */}
                    {scheme.uploadedRequirements && scheme.uploadedRequirements.map((req, i) => (
                      <li key={`up-${i}`} style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>
                        <span style={{ fontSize: '1.1rem' }}>✓</span>
                        <span>{req} ({language === 'hi' ? 'अपलोड और सत्यापित' : 'Uploaded & Verified'})</span>
                      </li>
                    ))}
                    {/* Render missing/other required documents */}
                    {scheme.missingRequirements && scheme.missingRequirements.map((req, i) => (
                      <li key={`mis-${i}`} style={{ color: '#d97706', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.9rem' }}>
                        <span style={{ fontSize: '1.1rem' }}>⚠</span>
                        <span>{req} ({language === 'hi' ? 'लापता - अपलोड आवश्यक' : 'Missing - Upload Required'})</span>
                      </li>
                    ))}
                    {/* Fallback if list classification isn't returned */}
                    {(!scheme.uploadedRequirements || scheme.uploadedRequirements.length === 0) && (!scheme.missingRequirements || scheme.missingRequirements.length === 0) && scheme.requirements.map((req, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.9rem' }}>
                        <span>•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          ))}
        </div>

        <div className="results-footer">
          <div className="footer-card">
            <h3 className="footer-title">{language === 'hi' ? 'मदद चाहिए?' : 'Need Help?'}</h3>
            <p className="footer-text">
              {language === 'hi' 
                ? 'हमारी सहायता टीम आवेदन प्रक्रिया में आपका मार्गदर्शन करने के लिए यहाँ है।' 
                : 'Our support team is here to guide you through the application process.'}
            </p>
            <button className="btn btn-secondary">
              {language === 'hi' ? 'सहायता से संपर्क करें' : 'Contact Support'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;