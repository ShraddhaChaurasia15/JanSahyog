import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';


import Chatbot from "../components/Chatbot";
import HeroSlider from "../components/HeroSlider";
function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeCard, setActiveCard] = useState(null);
  const categories = [
  {
    icon: "🌾",
    name: "Agriculture",
    count: "120 Schemes"
  },
  {
    icon: "🎓",
    name: "Education",
    count: "95 Schemes"
  },
  {
    icon: "🏥",
    name: "Healthcare",
    count: "80 Schemes"
  },
  {
    icon: "🏠",
    name: "Housing",
    count: "45 Schemes"
  },
  {
    icon: "👩",
    name: "Women Empowerment",
    count: "60 Schemes"
  },
  {
    icon: "💼",
    name: "Employment",
    count: "75 Schemes"
  }
];
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
     

  const features = [

    {
      icon: '🤖',
      title: 'AI-Powered Matching',
      description: 'Advanced machine learning algorithms analyze your profile to find the perfect government schemes for you.',
      color: '#1a56db',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: '📄',
      title: 'Smart Document OCR',
      description: 'Upload any document and our AI extracts all relevant information instantly with 99% accuracy.',
      color: '#7c3aed',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: '⚡',
      title: 'Instant Verification',
      description: 'Real-time eligibility checks with instant notifications for new schemes matching your profile.',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      icon: '🎯',
      title: 'Personalized Dashboard',
      description: 'Track all your applications, documents, and eligibility status in one beautiful interface.',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
      icon: '🔔',
      title: 'Smart Reminders',
      description: 'Never miss a deadline with intelligent reminders and automatic application tracking.',
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    },
    {
      icon: '🌐',
      title: 'Multi-Language Support',
      description: 'Access the platform in your preferred language with seamless translation.',
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)'
    }
  ];

  const testimonials=[
    {
      name: 'Priya Sharma',
      role: 'Small Business Owner',
      image: '👩‍💼',
      quote: 'Found 3 schemes I qualified for within minutes. The AI matching is incredible!',
      rating: 5
    },
    {
      name: 'Rajesh Kumar',
      role: 'Farmer',
      image: '👨‍🌾',
      quote: 'The document OCR saved me hours of paperwork. Highly recommended!',
      rating: 5
    },
    {
      name: 'Anita Patel',
      role: 'Student',
      image: '👩‍🎓',
      quote: 'Got my scholarship application approved in record time. Thank you!',
      rating: 5
    }
  ];

  return (
    <div className="home-page page-container">
      
      <HeroSlider />
      <div className="animated-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="gradient-orb"
          style={{
            left: `${mousePosition.x * 0.02}px`,
            top: `${mousePosition.y * 0.02}px`
          }}>
        </div>
      </div>

      <section className="hero-modern">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-badge-modern">
                <span className="badge-pulse"></span>
                <span className="badge-text"></span>
              </div>

              <h1 className="hero-title-modern">
                Your Gateway to
                <span className="gradient-text-animated"> Government Benefits</span>
              </h1>

              <p className="hero-subtitle">
                Discover, apply, and track government welfare schemes tailored just for you.
                Powered by AI. Simplified for everyone.
              </p>

              <div className="hero-cta-group">
                <Link to="/register" className="btn-modern btn-primary-modern">
                  <span>Start Your Journey</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7 3L14 10L7 17" stroke="currentColor" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link to="/login" className="btn-modern btn-outline-modern">
                  <span>Sign In</span>
                </Link>
              </div>
            </div>


            <div className="hero-visual-modern">
              <div className="visual-cards-container">
                <div className="glass-card card-float-1">
                  <div className="card-glow"></div>
                  <div className="card-header">
                    <div className="status-dot pulse-green"></div>
                    <span>Active Application</span>
                  </div>
                  <div className="card-body">
                    <div className="icon-badge">📋</div>
                    <h4>PM Kisan Scheme</h4>
                    <div className="progress-modern">
                      <div className="progress-fill" style={{ width: '75%' }}></div>
                    </div>
                    <p className="progress-text">75% Complete</p>
                  </div>
                </div>

                <div className="glass-card card-float-2">
                  <div className="card-glow"></div>
                  <div className="card-header">
                    <div className="status-dot pulse-blue"></div>
                    <span>AI Analysis</span>
                  </div>
                  <div className="card-body">
                    <div className="icon-badge">🎯</div>
                    <h4>3 New Matches</h4>
                    <p>Schemes you qualify for</p>
                  </div>
                </div>

                <div className="glass-card card-float-3">
                  <div className="card-glow"></div>
                  <div className="success-badge">✓ Verified</div>
                  <div className="card-body">
                    <div className="icon-badge">🛡️</div>
                    <h4>Documents Secure</h4>
                    <p>End-to-end encrypted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
       
      <section className="stats-section">
  <div className="container">

    <h2 className="stats-heading">
      Find Schemes For You
    </h2>

    <div className="stats-grid">

      <div className="stat-box">
        <h1>500+</h1>
        <p>Total Schemes</p>
      </div>

      <div className="stat-box">
        <h1>120+</h1>
        <p>Scholarships</p>
      </div>

      <div className="stat-box">
        <h1>80+</h1>
        <p>Healthcare Schemes</p>
      </div>

    </div>

  </div>
</section>

{/* Categories Section */}

<section className="categories-section">
  <div className="container">

    <h2 className="categories-heading">
      Browse Schemes By Category
    </h2>

    <div className="categories-grid">

     <Link
  to="/schemes/agriculture"
  className="category-card"
  style={{ textDecoration: "none" }}
>
  <div className="category-icon">🌾</div>
  <h3>Agriculture</h3>
  <p>120 Schemes</p>
</Link>

       <Link
    to="/schemes/education"
    className="category-card"
    style={{ textDecoration: "none" }}
  >
    <div className="category-icon">🎓</div>
    <h3>Education</h3>
    <p>95 Schemes</p>
  </Link>

  <Link
    to="/schemes/healthcare"
    className="category-card"
    style={{ textDecoration: "none" }}
  >
    <div className="category-icon">🏥</div>
    <h3>Healthcare</h3>
    <p>80 Schemes</p>
  </Link>

  <Link
    to="/schemes/housing"
    className="category-card"
    style={{ textDecoration: "none" }}
  >
    <div className="category-icon">🏠</div>
    <h3>Housing</h3>
    <p>45 Schemes</p>
  </Link>

  <Link
    to="/schemes/women"
    className="category-card"
    style={{ textDecoration: "none" }}
  >
    <div className="category-icon">👩</div>
    <h3>Women Welfare</h3>
    <p>60 Schemes</p>
  </Link>

  <Link
    to="/schemes/employment"
    className="category-card"
    style={{ textDecoration: "none" }}
  >
    <div className="category-icon">💼</div>
    <h3>Employment</h3>
    <p>75 Schemes</p>
  </Link>
    </div>

  </div>
</section>

<section className="features-modern">

  <div className="container">

    <div className="section-header-modern">
      <span className="section-tag">Features</span>
      <h2 className="section-title-modern">
        Everything You Need in
        <span className="gradient-text"> One Platform</span>
      </h2>
      <p className="section-description-modern">
        Powerful features designed to make accessing government schemes effortless
      </p>
    </div>

    <div className="bento-grid">
      {features.map((feature, index) => (
        <div
          key={index}
          className={`bento-card ${activeCard === index ? 'active' : ''}`}
          onMouseEnter={() => setActiveCard(index)}
          onMouseLeave={() => setActiveCard(null)}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div
            className="bento-glow"
            style={{ background: feature.gradient }}
          ></div>

          <div
            className="bento-icon"
            style={{ background: feature.gradient }}
          >
            {feature.icon}
          </div>

          <h3 className="bento-title">{feature.title}</h3>

          <p className="bento-description">
            {feature.description}
          </p>

          <div className="bento-arrow">→</div>
        </div>
      ))}
    </div>

  </div>
</section>
<Chatbot />
    </div>
  );
}

export default Home;