import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Home.css';


import Chatbot from "../components/Chatbot";
import HeroSlider from "../components/HeroSlider";
function Home() {
  const { language, t } = useLanguage();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeCard, setActiveCard] = useState(null);
  const categories = [
    {
      icon: "🌾",
      name: language === 'hi' ? 'कृषि' : 'Agriculture',
      count: language === 'hi' ? '120 योजनाएं' : '120 Schemes'
    },
    {
      icon: "🎓",
      name: language === 'hi' ? 'शिक्षा' : 'Education',
      count: language === 'hi' ? '95 योजनाएं' : '95 Schemes'
    },
    {
      icon: "🏥",
      name: language === 'hi' ? 'स्वास्थ्य सेवा' : 'Healthcare',
      count: language === 'hi' ? '80 योजनाएं' : '80 Schemes'
    },
    {
      icon: "🏠",
      name: language === 'hi' ? 'आवास' : 'Housing',
      count: language === 'hi' ? '45 योजनाएं' : '45 Schemes'
    },
    {
      icon: "👩",
      name: language === 'hi' ? 'महिला कल्याण' : 'Women Welfare',
      count: language === 'hi' ? '60 योजनाएं' : '60 Schemes'
    },
    {
      icon: "💼",
      name: language === 'hi' ? 'रोजगार' : 'Employment',
      count: language === 'hi' ? '75 योजनाएं' : '75 Schemes'
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
      title: language === 'hi' ? 'एआई-संचालित मिलान' : 'AI-Powered Matching',
      description: language === 'hi' ? 'उन्नत मशीन लर्निंग एल्गोरिदम आपके प्रोफाइल का विश्लेषण करके आपके लिए सही सरकारी योजनाएं ढूंढते हैं।' : 'Advanced machine learning algorithms analyze your profile to find the perfect government schemes for you.',
      color: '#1a56db',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: '📄',
      title: language === 'hi' ? 'स्मार्ट दस्तावेज़ OCR' : 'Smart Document OCR',
      description: language === 'hi' ? 'किसी भी दस्तावेज़ को अपलोड करें और हमारा एआई 99% सटीकता के साथ तुरंत सभी प्रासंगिक जानकारी निकाल लेता है।' : 'Upload any document and our AI extracts all relevant information instantly with 99% accuracy.',
      color: '#7c3aed',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: '⚡',
      title: language === 'hi' ? 'त्वरित सत्यापन' : 'Instant Verification',
      description: language === 'hi' ? 'आपकी प्रोफ़ाइल से मेल खाने वाली नई योजनाओं के लिए तत्काल सूचनाओं के साथ वास्तविक समय पात्रता जांच।' : 'Real-time eligibility checks with instant notifications for new schemes matching your profile.',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      icon: '🎯',
      title: language === 'hi' ? 'व्यक्तिगत डैशबोर्ड' : 'Personalized Dashboard',
      description: language === 'hi' ? 'एक सुंदर इंटरफ़ेस में अपने सभी आवेदनों, दस्तावेज़ों और पात्रता की स्थिति को ट्रैक करें।' : 'Track all your applications, documents, and eligibility status in one beautiful interface.',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
      icon: '🔔',
      title: language === 'hi' ? 'स्मार्ट अनुस्मारक' : 'Smart Reminders',
      description: language === 'hi' ? 'बुद्धिमान अनुस्मारक और स्वचालित आवेदन ट्रैकिंग के साथ कभी भी समय सीमा न चूकें।' : 'Never miss a deadline with intelligent reminders and automatic application tracking.',
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    },
    {
      icon: '🌐',
      title: language === 'hi' ? 'बहु-भाषा समर्थन' : 'Multi-Language Support',
      description: language === 'hi' ? 'निर्बाध अनुवाद के साथ अपनी पसंदीदा भाषा में प्लेटफ़ॉर्म का उपयोग करें।' : 'Access the platform in your preferred language with seamless translation.',
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
                {t('hero_title_1')}
                <span className="gradient-text-animated">{t('hero_title_2')}</span>
              </h1>

              <p className="hero-subtitle">
                {t('hero_subtitle')}
              </p>

              <div className="hero-cta-group">
                <Link to="/register" className="btn-modern btn-primary-modern">
                  <span>{t('hero_cta_start')}</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7 3L14 10L7 17" stroke="currentColor" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link to="/login" className="btn-modern btn-outline-modern">
                  <span>{t('hero_cta_signin')}</span>
                </Link>
              </div>
            </div>


            <div className="hero-visual-modern">
              <div className="how-it-works-visual-card">
                <div className="card-glow"></div>
                <h3 className="how-title">{t('how_works_title')}</h3>
                <p className="how-subtitle-small">{t('how_works_subtitle')}</p>
                
                <div className="how-steps-container">
                  <div className="how-step-item">
                    <div className="step-num">1</div>
                    <div className="step-content">
                      <h4>{t('how_step_1_title')}</h4>
                      <p>{t('how_step_1_desc')}</p>
                    </div>
                  </div>
                  <div className="how-step-arrow">↓</div>
                  
                  <div className="how-step-item">
                    <div className="step-num">2</div>
                    <div className="step-content">
                      <h4>{t('how_step_2_title')}</h4>
                      <p>{t('how_step_2_desc')}</p>
                    </div>
                  </div>
                  <div className="how-step-arrow">↓</div>
                  
                  <div className="how-step-item">
                    <div className="step-num">3</div>
                    <div className="step-content">
                      <h4>{t('how_step_3_title')}</h4>
                      <p>{t('how_step_3_desc')}</p>
                    </div>
                  </div>
                  <div className="how-step-arrow">↓</div>
                  
                  <div className="how-step-item">
                    <div className="step-num">4</div>
                    <div className="step-content">
                      <h4>{t('how_step_4_title')}</h4>
                      <p>{t('how_step_4_desc')}</p>
                    </div>
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

      <footer className="premium-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-column footer-brand">
              <Link to="/" className="footer-logo">
                JanSahyog
              </Link>
              <p className="footer-description">
                {language === 'hi'
                  ? 'एआई मिलान का उपयोग करके सरकारी कल्याणकारी योजनाओं तक पहुंच को सरल बनाकर नागरिकों को सशक्त बनाना।'
                  : 'Empowering citizens by simplifying access to government welfare schemes using AI matching.'}
              </p>
            </div>

            <div className="footer-column">
              <h3>{language === 'hi' ? 'संपर्क करें' : 'Contact Us'}</h3>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">📞</span>
                <span>{language === 'hi' ? 'हेल्पलाइन' : 'Helpline'}: +91 1800 123 4567</span>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">✉️</span>
                <span>{language === 'hi' ? 'ईमेल' : 'Email'}: support@jansahyog.gov.in</span>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-copyright">
              {language === 'hi'
                ? 'कॉपीराइट © 2026 जनसहयोग। सर्वाधिकार सुरक्षित।'
                : 'Copyright © 2026 JanSahyog. All rights reserved.'}
            </div>
            <div className="footer-credit">
              {language === 'hi'
                ? 'भारत के नागरिकों के लिए ❤️ के साथ बनाया गया'
                : 'Made with ❤️ for Citizens of India'}
            </div>
          </div>
        </div>
      </footer>

<Chatbot />
    </div>
  );
}

export default Home;