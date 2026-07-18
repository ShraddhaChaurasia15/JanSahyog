import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navbar
    nav_home: 'Home',
    nav_schemes: 'Schemes',
    nav_check_eligibility: 'Check Eligibility',
    nav_my_profile: 'My Profile',
    nav_login: 'Login',
    nav_logout: 'Logout',
    nav_get_started: 'Get Started',
    nav_about: 'About',

    // Home
    hero_title_1: 'Your Gateway to',
    hero_title_2: ' Government Benefits',
    hero_subtitle: 'Discover, apply, and track government welfare schemes tailored just for you. Powered by AI. Simplified for everyone.',
    hero_cta_start: 'Start Your Journey',
    hero_cta_signin: 'Sign In',
    how_works_title: 'How It Works',
    how_works_subtitle: 'Four simple steps to discover your benefits',
    how_step_1_title: 'Create Account',
    how_step_1_desc: 'Sign up with your phone or email',
    how_step_2_title: 'Fill Your Details',
    how_step_2_desc: 'Add basic info like age, income, category',
    how_step_3_title: 'Upload Documents',
    how_step_3_desc: 'Aadhar, PAN, Income Certificate, etc.',
    how_step_4_title: 'Get Matched',
    how_step_4_desc: "We find schemes you're eligible for",

    // Dashboard
    dash_welcome: 'Welcome back',
    dash_subtitle: 'Here is a summary of your profile, document vault, and welfare schemes',
    dash_check_new: 'Check New Schemes',
    dash_stat_matched: 'Schemes Matched',
    dash_stat_applied: 'Applications',
    dash_stat_approved: 'Approved',
    dash_profile_title: 'Citizen Profile',
    dash_profile_card_header: 'Jansahyog Identity Card',
    dash_profile_card_sub: 'Government of India Welfare Portal',
    dash_profile_name: 'Full Name',
    dash_profile_state: 'State of Origin',
    dash_profile_gender_age: 'Gender / Age',
    dash_profile_income: 'Income Class',
    dash_profile_category: 'Category Classification',
    dash_profile_update: 'Update Profile',
    dash_rec_title: 'Your Recommended Schemes',
    dash_badge_verified: 'Verified',
    dash_vault_title: 'Verified Document Vault',
    dash_vault_item_verified: 'Verified via OCR',
    dash_vault_item_pending: 'Pending Upload',
    dash_vault_action: 'Go to Document Vault',
    dash_app_title: 'Application Status',
    dash_app_submitted: 'Submitted',
    dash_app_action: 'Track Detailed Progress',
    dash_support_title: 'Support Hub',
    dash_support_chat: 'Ask AI Assistant',
    dash_support_desc: 'Get answers to your welfare queries',
    dash_onboarding_cta_title: 'Complete Your Profile to Unlock Recommendations',
    dash_onboarding_cta_desc: 'Provide your basic details or drop your Aadhaar Card to get matching schemes instantly using our AI recommendation engine.',
    dash_onboarding_cta_btn: 'Complete Profile Now',

    // Check Eligibility
    el_title: 'Check Eligibility & Scan ID',
    el_subtitle: 'Scan your document to auto-fill the form and find matched welfare schemes.',
    el_drop_prompt: 'Drag & drop Aadhaar or ID here, or click to browse',
    el_scanning: 'Scanning document...',
    el_autofill_badge: 'Autofilled',
    el_form_age: 'Age',
    el_form_income: 'Annual Income (₹)',
    el_form_category: 'Category',
    el_form_state: 'State',
    el_form_gender: 'Gender',
    el_btn_submit: 'Check Schemes & Match Eligibility',
    el_form_select: 'Select',

    // Results
    res_title: 'Recommended Schemes',
    res_subtitle: 'Based on your profile details and document analysis',
    res_stat_prob: 'Statistical Match Probability',
    res_stat_benefit: 'Expected Benefit',
    res_stat_confidence: 'Statistical Confidence',
    res_why_eligible: "Why you're eligible:",
    res_apply_now: 'Apply Now',
    res_view_details: 'View Details',
    res_checklist_title: 'Required Documents Checklist',
    res_checklist_uploaded: 'Uploaded & Verified',
    res_checklist_missing: 'Missing - Upload Required'
  },
  hi: {
    // Navbar
    nav_home: 'मुख्य पृष्ठ',
    nav_schemes: 'योजनाएं',
    nav_check_eligibility: 'पात्रता जांचें',
    nav_my_profile: 'मेरी प्रोफाइल',
    nav_login: 'लॉगिन',
    nav_logout: 'लॉगआउट',
    nav_get_started: 'शुरू करें',
    nav_about: 'हमारे बारे में',

    // Home
    hero_title_1: 'सरकारी लाभों के लिए आपका',
    hero_title_2: ' प्रवेश द्वार',
    hero_subtitle: 'अपने लिए विशेष रूप से तैयार की गई सरकारी कल्याणकारी योजनाओं को खोजें, आवेदन करें और ट्रैक करें। एआई द्वारा संचालित। सभी के लिए सरल।',
    hero_cta_start: 'अपनी यात्रा शुरू करें',
    hero_cta_signin: 'साइन इन करें',
    how_works_title: 'यह कैसे काम करता है',
    how_works_subtitle: 'अपने लाभों को खोजने के लिए चार सरल कदम',
    how_step_1_title: 'खाता बनाएं',
    how_step_1_desc: 'अपने फोन या ईमेल के साथ साइन अप करें',
    how_step_2_title: 'विवरण भरें',
    how_step_2_desc: 'मूल जानकारी जैसे आयु, आय, श्रेणी जोड़ें',
    how_step_3_title: 'दस्तावेज अपलोड करें',
    how_step_3_desc: 'आधार, पैन, आय प्रमाण पत्र आदि',
    how_step_4_title: 'मैच प्राप्त करें',
    how_step_4_desc: 'हम उन योजनाओं को खोजते हैं जिनके लिए आप पात्र हैं',

    // Dashboard
    dash_welcome: 'स्वागत है',
    dash_subtitle: 'यहाँ आपकी प्रोफ़ाइल, दस्तावेज़ तिजोरी और कल्याणकारी योजनाओं का विवरण है',
    dash_check_new: 'नई योजनाएं जांचें',
    dash_stat_matched: 'योजनाएं मेल खाईं',
    dash_stat_applied: 'आवेदन',
    dash_stat_approved: 'स्वीकृत',
    dash_profile_title: 'नागरिक प्रोफाइल',
    dash_profile_card_header: 'जनसहयोग पहचान पत्र',
    dash_profile_card_sub: 'भारत सरकार कल्याण पोर्टल',
    dash_profile_name: 'पूरा नाम',
    dash_profile_state: 'मूल राज्य',
    dash_profile_gender_age: 'लिंग / आयु',
    dash_profile_income: 'आय वर्ग',
    dash_profile_category: 'श्रेणी वर्गीकरण',
    dash_profile_update: 'प्रोफ़ाइल अपडेट करें',
    dash_rec_title: 'आपके लिए अनुशंसित योजनाएं',
    dash_badge_verified: 'सत्यापित',
    dash_vault_title: 'सत्यापित दस्तावेज़ तिजोरी',
    dash_vault_item_verified: 'ओसीआर द्वारा सत्यापित',
    dash_vault_item_pending: 'अपलोड लंबित',
    dash_vault_action: 'दस्तावेज़ तिजोरी पर जाएं',
    dash_app_title: 'आवेदन की स्थिति',
    dash_app_submitted: 'जमा किया गया',
    dash_app_action: 'विस्तृत प्रगति ट्रैक करें',
    dash_support_title: 'सहायता केंद्र',
    dash_support_chat: 'एआई सहायक से पूछें',
    dash_support_desc: 'अपने कल्याणकारी प्रश्नों के उत्तर प्राप्त करें',
    dash_onboarding_cta_title: 'सिफारिशों को अनलॉक करने के लिए अपनी प्रोफाइल पूरी करें',
    dash_onboarding_cta_desc: 'हमारे एआई अनुशंसा इंजन का उपयोग करके तुरंत मिलान योजनाएं प्राप्त करने के लिए अपना मूल विवरण प्रदान करें या अपना आधार कार्ड जमा करें।',
    dash_onboarding_cta_btn: 'प्रोफाइल अभी पूरी करें',

    // Check Eligibility
    el_title: 'पात्रता जांचें और आईडी स्कैन करें',
    el_subtitle: 'फॉर्म को स्वचालित रूप से भरने और मेल खाने वाली कल्याणकारी योजनाओं को खोजने के लिए अपने दस्तावेज़ को स्कैन करें।',
    el_drop_prompt: 'आधार या आईडी यहां खींचें और छोड़ें, या ब्राउज़ करने के लिए क्लिक करें',
    el_scanning: 'दस्तावेज़ स्कैन हो रहा है...',
    el_autofill_badge: 'स्वतः भरा गया',
    el_form_age: 'आयु',
    el_form_income: 'वार्षिक आय (₹)',
    el_form_category: 'श्रेणी',
    el_form_state: 'राज्य',
    el_form_gender: 'लिंग',
    el_btn_submit: 'योजनाएं जांचें और पात्रता का मिलान करें',
    el_form_select: 'चुनें',

    // Results
    res_title: 'अनुशंसित योजनाएं',
    res_subtitle: 'आपकी प्रोफ़ाइल विवरण और दस्तावेज़ विश्लेषण के आधार पर',
    res_stat_prob: 'सांख्यिकीय मिलान संभावना',
    res_stat_benefit: 'अपेक्षित लाभ',
    res_stat_confidence: 'सांख्यिकीय विश्वास',
    res_why_eligible: 'आप क्यों पात्र हैं:',
    res_apply_now: 'अभी आवेदन करें',
    res_view_details: 'विवरण देखें',
    res_checklist_title: 'आवश्यक दस्तावेज चेकलिस्ट',
    res_checklist_uploaded: 'अपलोड और सत्यापित',
    res_checklist_missing: 'लापता - अपलोड आवश्यक'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
