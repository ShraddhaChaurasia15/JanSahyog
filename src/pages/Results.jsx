import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Results.css';

function Results(){
  const location = useLocation();
  const schemes = location.state?.schemes || [];

  if (schemes.length === 0) {
    return (

       <div className="results-page page-container">
        <div className="container">
          <div className="empty-state fade-in">
            <div className="empty-icon">🔍</div>
            <h2 className="empty-title">No Results Found</h2>
            <p className="empty-description">
              We couldn't find any schemes matching your criteria. 
              Try adjusting your details or check back later for new schemes.
            </p>
            {/* <Link to="/check-eligibility" className="btn bg-black">
              Check Again
            </Link> */}
               <Link to="/check-eligibility" className="btn btn-primary">
              Check Again
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
            <h1 className="page-title">Your Eligible Schemes</h1>
            <p className="page-subtitle">
              We found {schemes.length} scheme{schemes.length !== 1 ? 's' : ''} you're eligible for
            </p>
          </div>
          <Link to="/check-eligibility" className="btn btn-outline">
            
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M14 7L10 3L6 7" stroke="currentColor" strokeWidth="2" 
                    strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 3V13" stroke="currentColor" strokeWidth="2" 
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Check Again
          </Link>
        </div>

        {/* Success Banner */}
        <div className="success-banner slide-in-left">
          <div className="banner-icon">🎉</div>
          <div className="banner-content">
            <h3 className="banner-title">Great News!</h3>
            <p className="banner-text">
              You qualify for multiple welfare schemes. Review the details below and apply for the ones that suit you best.
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
                <div className="result-match">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2L10 6L14 6.5L11 9.5L11.5 14L8 12L4.5 14L5 9.5L2 6.5L6 6L8 2Z" 
                          fill="currentColor"/>
                  </svg>
                  {scheme.matchScore || 95}% Match
                </div>
              </div>

              <h3 className="result-title">{scheme.name}</h3>
              <p className="result-description">{scheme.description}</p>

              <div className="result-benefits">
                <div className="benefit-item">
                   <span className="benefit-icon">💰</span>
                  <div>
                     <div className="benefit-label">Benefit Amount</div>
                    <div className="benefit-value">{scheme.benefits || 'As per scheme'}</div>
                  </div>
                </div>
                
                {scheme.duration && (
                  <div className="benefit-item">
                    <span className="benefit-icon">⏱️</span>
                    <div>
                      <div className="benefit-label">Duration</div>
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
                  
                   Why you're eligible:
                  </div>
                  <p>{scheme.eligibilityReason}</p>
                </div>
              )}

              <div className="result-actions">
                <button className="btn btn-primary btn-full">
                  Apply Now
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" 
                          strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="btn btn-outline btn-full">
                  View Details
                </button>
              </div>

              {scheme.requirements && (
                
                <details className="result-details">
                  <summary>Required Documents</summary>
                  <ul className="requirements-list">
                    {scheme.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          ))}
        </div>

       
        <div className="results-footer">
          <div className="footer-card">
            <h3 className="footer-title">Need Help?</h3>
            
             <p className="footer-text">
              
              Our support team is here to guide you through the application process.
            
            </p>
            <button className="btn btn-secondary">
              Contact Support
            </button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Results;