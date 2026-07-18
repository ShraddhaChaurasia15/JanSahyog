import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Navbar.css';

function Navbar({ isAuthenticated, user, onLogout }) {
  const { language, changeLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSchemesMenu, setShowSchemesMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const schemeCategories = [
    { id: 'agriculture', name: 'Agriculture', icon: '🌾' },
    { id: 'education', name: 'Education', icon: '🎓' },
    { id: 'healthcare', name: 'Healthcare', icon: '🏥' },
    { id: 'housing', name: 'Housing', icon: '🏠' },
    { id: 'women', name: 'Women Welfare', icon: '👩' },
    { id: 'employment', name: 'Employment', icon: '💼' }
  ];

  //use effect 
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setShowUserMenu(false);
    setShowSchemesMenu(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.nav-user') && !e.target.closest('.user-dropdown')) {
        setShowUserMenu(false);
      }
      if (!e.target.closest('.nav-dropdown-wrapper') && !e.target.closest('.schemes-dropdown-menu')) {
        setShowSchemesMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setIsMenuOpen(false);
    setShowUserMenu(false);
    setShowSchemesMenu(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setShowUserMenu(false);
  };

  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setShowUserMenu(!showUserMenu);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">
            {/* <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
              <path 
                d="M16 4L4 10V18C4 24 16 28 16 28C16 28 28 24 28 18V10L16 4Z"
                fill="currentColor" 
                opacity="0.2" 
              />
              <path 
                d="M16 4L4 10V18C4 24 16 28 16 28C16 28 28 24 28 18V10L16 4Z"
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />

              <path 
                d="M12 16L15 19L21 13"
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg> */}
          </div>
          <div className="brand-content">
            <span className="brand-text">JanSahyog</span>
            <span className="brand-tagline">Empowering Citizens</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-desktop">
          {isAuthenticated ? (
            <>
              <Link 
                to="/" 
                className={`nav-link ${isActiveLink('/') ? 'active' : ''}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{t('nav_home')}</span>
              </Link>

              <div className="nav-dropdown-wrapper">
                <button 
                  className={`nav-link dropdown-toggle-btn ${showSchemesMenu ? 'active' : ''}`}
                  onClick={() => setShowSchemesMenu(!showSchemesMenu)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{t('nav_schemes')}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className={`arrow-icon ${showSchemesMenu ? 'open' : ''}`} style={{ marginLeft: '4px', transition: 'transform 0.2s ease' }}>
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {showSchemesMenu && (
                  <div className="schemes-dropdown-menu">
                    {schemeCategories.map(cat => (
                      <Link 
                        key={cat.id} 
                        to={`/schemes/${cat.id}`} 
                        className="schemes-dropdown-item" 
                        onClick={() => setShowSchemesMenu(false)}
                      >
                        <span className="dropdown-item-icon">{cat.icon}</span>
                        <span>
                          {language === 'hi' 
                            ? (cat.id === 'agriculture' ? 'कृषि' : cat.id === 'education' ? 'शिक्षा' : cat.id === 'healthcare' ? 'स्वास्थ्य सेवा' : cat.id === 'housing' ? 'आवास' : cat.id === 'women' ? 'महिला कल्याण' : 'रोजगार') 
                            : cat.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              <Link 
                to="/check-eligibility" 
                className={`nav-link ${isActiveLink('/check-eligibility') ? 'active' : ''}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{t('nav_check_eligibility')}</span>
              </Link>

              <Link 
                to="/dashboard" 
                className={`nav-link ${isActiveLink('/dashboard') ? 'active' : ''}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>{t('nav_my_profile')}</span>
              </Link>

              {/* Language Selector */}
              <div className="language-selector-wrapper" style={{ display: 'flex', alignItems: 'center', marginRight: '1rem', border: '1px solid var(--gray-200)', borderRadius: '6px', padding: '2px' }}>
                <button 
                  className={`lang-selector-btn ${language === 'en' ? 'active' : ''}`}
                  onClick={() => changeLanguage('en')}
                  style={{
                    background: language === 'en' ? 'var(--primary-light)' : 'none',
                    color: language === 'en' ? 'var(--primary)' : 'var(--gray-600)',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  EN
                </button>
                <button 
                  className={`lang-selector-btn ${language === 'hi' ? 'active' : ''}`}
                  onClick={() => changeLanguage('hi')}
                  style={{
                    background: language === 'hi' ? 'var(--primary-light)' : 'none',
                    color: language === 'hi' ? 'var(--primary)' : 'var(--gray-600)',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  हिन्दी
                </button>
              </div>

              {/* User Menu */}
              <div className="nav-user">
                <button className="user-button" onClick={toggleUserMenu}>
                  <div className="user-avatar">
                    <span>{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                    <div className="user-status"></div>
                  </div>
                  <div className="user-info">
                    <span className="user-name">{user?.name || 'User'}</span>
                    <span className="user-email">{user?.email || 'user@example.com'}</span>
                  </div>
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none"
                    className={`dropdown-arrow ${showUserMenu ? 'open' : ''}`}
                  >
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <div className="dropdown-avatar">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="dropdown-info">
                        <p className="dropdown-name">{user?.name || 'User'}</p>
                        <p className="dropdown-email">{user?.email || 'user@example.com'}</p>
                      </div>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    <Link to="/dashboard" className="dropdown-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <span>My Profile</span>
                    </Link>
                    
                  <div className="dropdown-divider"></div>
                  
                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                     <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>

          ) : (
            <>
              <Link 
                to="/" 
                className={`nav-link ${isActiveLink('/') ? 'active' : ''}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{t('nav_home')}</span>
              </Link>

              <div className="nav-dropdown-wrapper">
                <button 
                  className={`nav-link dropdown-toggle-btn ${showSchemesMenu ? 'active' : ''}`}
                  onClick={() => setShowSchemesMenu(!showSchemesMenu)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{t('nav_schemes')}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className={`arrow-icon ${showSchemesMenu ? 'open' : ''}`} style={{ marginLeft: '4px', transition: 'transform 0.2s ease' }}>
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {showSchemesMenu && (
                  <div className="schemes-dropdown-menu">
                    {schemeCategories.map(cat => (
                      <Link 
                        key={cat.id} 
                        to={`/schemes/${cat.id}`} 
                        className="schemes-dropdown-item" 
                        onClick={() => setShowSchemesMenu(false)}
                      >
                        <span className="dropdown-item-icon">{cat.icon}</span>
                        <span>
                          {language === 'hi' 
                            ? (cat.id === 'agriculture' ? 'कृषि' : cat.id === 'education' ? 'शिक्षा' : cat.id === 'healthcare' ? 'स्वास्थ्य सेवा' : cat.id === 'housing' ? 'आवास' : cat.id === 'women' ? 'महिला कल्याण' : 'रोजगार') 
                            : cat.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              <Link 
                to="/about" 
                className={`nav-link ${isActiveLink('/about') ? 'active' : ''}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>{t('nav_about')}</span>
              </Link>
              
              {/* Language Selector */}
              <div className="language-selector-wrapper" style={{ display: 'flex', alignItems: 'center', marginRight: '0.5rem', border: '1px solid var(--gray-200)', borderRadius: '6px', padding: '2px' }}>
                <button 
                  className={`lang-selector-btn ${language === 'en' ? 'active' : ''}`}
                  onClick={() => changeLanguage('en')}
                  style={{
                    background: language === 'en' ? 'var(--primary-light)' : 'none',
                    color: language === 'en' ? 'var(--primary)' : 'var(--gray-600)',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  EN
                </button>
                <button 
                  className={`lang-selector-btn ${language === 'hi' ? 'active' : ''}`}
                  onClick={() => changeLanguage('hi')}
                  style={{
                    background: language === 'hi' ? 'var(--primary-light)' : 'none',
                    color: language === 'hi' ? 'var(--primary)' : 'var(--gray-600)',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  हिन्दी
                </button>
              </div>

              <Link to="/login" className="btn btn-ghost">
                {t('nav_login')}
              </Link>
              
              <Link to="/register" className="btn btn-primary">
                <span>{t('nav_get_started')}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </>
          )}
        </div>

      
        <button 
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`} 
          onClick={toggleMenu} 
          aria-label="Toggle menu"
        >
          <span className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <div className={`navbar-mobile ${isMenuOpen ? 'active' : ''}`}>
          <div className="mobile-menu-content">
            {isAuthenticated ? (
              <>
                <div className="mobile-user-header">
                  <div className="mobile-user-avatar">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="mobile-user-info">
                    <p className="mobile-user-name">{user?.name || 'User'}</p>
                    <p className="mobile-user-email">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>

                <div className="mobile-divider"></div>

                 <Link to="/" className="mobile-nav-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{t('nav_home')}</span>
                </Link>

                <div className="mobile-schemes-section">
                  <button className="mobile-nav-link collapsible-header" onClick={() => setShowSchemesMenu(!showSchemesMenu)} style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', outline: 'none', display: 'flex', alignItems: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--gray-400)' }}>
                      <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{t('nav_schemes')}</span>
                    <span className="collapsible-arrow" style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--gray-400)' }}>{showSchemesMenu ? '▼' : '▶'}</span>
                  </button>
                  {showSchemesMenu && (
                    <div className="mobile-submenu" style={{ paddingLeft: '1.5rem', background: '#f8fafc', borderRadius: '8px', marginTop: '4px' }}>
                      {schemeCategories.map(cat => (
                        <Link 
                          key={cat.id} 
                          to={`/schemes/${cat.id}`} 
                          className="mobile-nav-link mobile-submenu-link" 
                          onClick={() => { setIsMenuOpen(false); setShowSchemesMenu(false); }}
                          style={{ padding: '0.5rem 0' }}
                        >
                          <span style={{ marginRight: '8px' }}>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link to="/check-eligibility" className="mobile-nav-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{t('nav_check_eligibility')}</span>
                </Link>

                <Link to="/dashboard" className="mobile-nav-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>{t('nav_my_profile')}</span>
                </Link>

                <div className="mobile-divider"></div>

                <button className="mobile-nav-link logout-link" onClick={handleLogout}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{t('nav_logout')}</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="mobile-nav-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{t('nav_home')}</span>
                </Link>

                <div className="mobile-schemes-section">
                  <button className="mobile-nav-link collapsible-header" onClick={() => setShowSchemesMenu(!showSchemesMenu)} style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', outline: 'none', display: 'flex', alignItems: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--gray-400)' }}>
                      <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{t('nav_schemes')}</span>
                    <span className="collapsible-arrow" style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--gray-400)' }}>{showSchemesMenu ? '▼' : '▶'}</span>
                  </button>
                  {showSchemesMenu && (
                    <div className="mobile-submenu" style={{ paddingLeft: '1.5rem', background: '#f8fafc', borderRadius: '8px', marginTop: '4px' }}>
                      {schemeCategories.map(cat => (
                        <Link 
                          key={cat.id} 
                          to={`/schemes/${cat.id}`} 
                          className="mobile-nav-link mobile-submenu-link" 
                          onClick={() => { setIsMenuOpen(false); setShowSchemesMenu(false); }}
                          style={{ padding: '0.5rem 0' }}
                        >
                          <span style={{ marginRight: '8px' }}>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link to="/about" className="mobile-nav-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>{t('nav_about')}</span>
                </Link>

                <div className="mobile-divider"></div>

                <Link to="/login" className="btn btn-ghost btn-full">
                  {t('nav_login')}
                </Link>

                <Link to="/register" className="btn btn-primary btn-full">
                  <span>{t('nav_get_started')}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </>
            )}

            {/* Mobile Universal Language Selector */}
            <div className="mobile-divider"></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem' }}>
              <span style={{ color: 'var(--gray-500)', fontSize: '0.9rem', fontWeight: '500' }}>🌐 Language / भाषा:</span>
              <button 
                onClick={() => changeLanguage('en')}
                style={{
                  background: language === 'en' ? 'var(--primary-light)' : 'none',
                  color: language === 'en' ? 'var(--primary)' : 'var(--gray-600)',
                  border: '1px solid var(--gray-200)',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                English
              </button>
              <button 
                onClick={() => changeLanguage('hi')}
                style={{
                  background: language === 'hi' ? 'var(--primary-light)' : 'none',
                  color: language === 'hi' ? 'var(--primary)' : 'var(--gray-600)',
                  border: '1px solid var(--gray-200)',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </div>

      
      {isMenuOpen && <div className="navbar-overlay" onClick={() => setIsMenuOpen(false)}></div>}
    </nav>
  );
}

export default Navbar;