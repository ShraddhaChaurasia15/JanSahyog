import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import schemesData from '../data/schemes.json';
import './CategorySchemes.css';

function CategorySchemes() {
  const { category } = useParams();
  const navigate = useNavigate();

  const categories = [
    { id: 'agriculture', name: 'Agriculture', icon: '🌾' },
    { id: 'education', name: 'Education', icon: '🎓' },
    { id: 'healthcare', name: 'Healthcare', icon: '🏥' },
    { id: 'housing', name: 'Housing', icon: '🏠' },
    { id: 'women', name: 'Women Welfare', icon: '👩' },
    { id: 'employment', name: 'Employment', icon: '💼' }
  ];

  const activeCategory = category || 'agriculture';

  const categorySchemes = schemesData.filter(
    (scheme) => scheme.category.toLowerCase() === activeCategory.toLowerCase()
  );

  return (
    <div className="category-schemes-page page-container">
      <div className="bg-gradient-header"></div>
      
      <div className="container">
        {/* Header */}
        <div className="schemes-header fade-in">
          <h1 className="schemes-title">Explore Welfare Schemes</h1>
          <p className="schemes-subtitle">Find government benefits, scholarships, and grants filtered by category</p>
        </div>

        {/* Categories Tab Swiper */}
        <div className="categories-tabs-container slide-in-top">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-tab-btn ${activeCategory.toLowerCase() === cat.id ? 'active' : ''}`}
              onClick={() => navigate(`/schemes/${cat.id}`)}
            >
              <span className="tab-icon">{cat.icon}</span>
              <span className="tab-name">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Schemes Results Grid */}
        <div className="schemes-grid-modern">
          {categorySchemes.length > 0 ? (
            categorySchemes.map((scheme) => (
              <div key={scheme.id} className="scheme-details-card fade-in">
                <div className="card-top">
                  <div className="scheme-badge-wrapper">
                    <span className="scheme-tag-btn">{scheme.category.toUpperCase()}</span>
                  </div>
                  <h2 className="scheme-title-text">{scheme.name}</h2>
                  <p className="scheme-description-text">{scheme.description}</p>
                </div>

                <div className="card-middle-details">
                  <div className="details-box">
                    <h4>🎁 Benefits</h4>
                    <ul>
                      {scheme.benefits?.map((benefit, i) => (
                        <li key={i}>{benefit}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="details-box">
                    <h4>🎯 Eligibility</h4>
                    <ul>
                      {scheme.eligibility?.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="details-box full-width-box">
                    <h4>📋 Required Documents</h4>
                    <div className="docs-pills-list">
                      {scheme.documents?.map((doc, i) => (
                        <span key={i} className="doc-pill-tag">🖨️ {doc}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="card-bottom-actions">
                  <button
                    onClick={() => window.open(scheme.applyLink, "_blank")}
                    className="btn btn-primary btn-full-width"
                  >
                    Apply Now
                  </button>
                  <button
                    onClick={() => window.open(scheme.officialWebsite, "_blank")}
                    className="btn btn-outline btn-full-width"
                  >
                    Official Website
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-schemes-box">
              <p>No schemes available under this category currently.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategorySchemes;