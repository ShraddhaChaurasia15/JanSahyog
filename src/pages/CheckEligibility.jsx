import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import './CheckEligibility.css';

function CheckEligibility() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    age: '',
    income: '',
    category: '',
    state: '',
    gender: ''
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [ocrSuccess, setOcrSuccess] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [detectedDocType, setDetectedDocType] = useState('');
  const [autofilledFields, setAutofilledFields] = useState({
    age: false,
    gender: false
  });

  const categories = ['General', 'OBC', 'SC', 'ST', 'EWS'];
  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  useEffect(() => {
    // Pre-populate with existing profile details if any
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.profile) {
          setFormData({
            age: parsedUser.profile.age || '',
            income: parsedUser.profile.income || '',
            category: parsedUser.profile.category || '',
            state: parsedUser.profile.state || '',
            gender: parsedUser.profile.gender || ''
          });
        }
      } catch (err) {
        console.error('Failed to parse user data from localStorage', err);
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Remove highlight on manual change
    if (autofilledFields[e.target.name]) {
      setAutofilledFields({
        ...autofilledFields,
        [e.target.name]: false
      });
    }
    setError('');
  };

  const processOCR = async (selectedFile) => {
    setScanning(true);
    setError('');
    setSuccessMsg('');
    setOcrSuccess(false);

    try {
      const data = new FormData();
      data.append('file', selectedFile);

      const response = await api.uploadDocument(data);
      const extracted = response.data.data;

      if (extracted) {
        let updatedForm = { ...formData };
        let newAutofilled = { ...autofilledFields };

        // Document Type Classification
        let docType = "Aadhaar Card"; 
        if (extracted.pan && extracted.pan.length > 0) {
          docType = "PAN Card";
        } else if (extracted.raw_text && extracted.raw_text.toLowerCase().includes("income")) {
          docType = "Income Certificate";
        } else if (extracted.raw_text && extracted.raw_text.toLowerCase().includes("caste")) {
          docType = "Caste Certificate";
        }
        
        let translatedDocType = docType;
        if (language === 'hi') {
          if (docType === "Aadhaar Card") translatedDocType = "आधार कार्ड";
          else if (docType === "PAN Card") translatedDocType = "पैन कार्ड";
          else if (docType === "Income Certificate") translatedDocType = "आय प्रमाण पत्र";
          else if (docType === "Caste Certificate") translatedDocType = "जाति प्रमाण पत्र";
        }

        setDetectedDocType(docType);

        // 1. Handle Gender
        if (extracted.gender) {
          updatedForm.gender = extracted.gender;
          newAutofilled.gender = true;
        }

        // 2. Handle Age from Date of Birth
        if (extracted.dob) {
          // Format could be DD/MM/YYYY
          const parts = extracted.dob.split('/');
          if (parts.length === 3) {
            const dobYear = parseInt(parts[2]);
            const currentYear = new Date().getFullYear();
            if (!isNaN(dobYear) && dobYear > 1900 && dobYear <= currentYear) {
              const age = currentYear - dobYear;
              updatedForm.age = age;
              newAutofilled.age = true;
            }
          }
        }

        setFormData(updatedForm);
        setAutofilledFields(newAutofilled);
        setOcrSuccess(true);
        
        let details = [];
        if (extracted.name) details.push(`${language === 'hi' ? 'नाम' : 'Name'}: ${extracted.name}`);
        if (extracted.gender) details.push(`${language === 'hi' ? 'लिंग' : 'Gender'}: ${extracted.gender}`);
        if (updatedForm.age) details.push(`${language === 'hi' ? 'आयु' : 'Age'}: ${updatedForm.age}`);

        setSuccessMsg(language === 'hi' 
          ? `${translatedDocType} सफलतापूर्वक स्कैन किया गया! निकाला गया: ${details.join(', ')}` 
          : `Document scanned successfully! Extracted: ${details.join(', ')}`);
      } else {
        setError(language === 'hi' ? 'दस्तावेज़ से कोई जानकारी नहीं पढ़ी जा सकी।' : 'No information could be read from the document.');
      }
    } catch (err) {
      console.error('OCR scanning error:', err);
      setError(language === 'hi' 
        ? 'दस्तावेज़ स्कैन विफल रहा। कृपया विवरण मैन्युअल रूप से दर्ज करें।' 
        : (err.response?.data?.message || err.response?.data?.error || 'Document scanning failed. Please enter details manually.'));
    } finally {
      setScanning(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }
      setFile(selectedFile);
      processOCR(selectedFile);
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
      processOCR(droppedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Update Profile in database
      const profileData = {
        age: parseInt(formData.age),
        income: parseFloat(formData.income),
        category: formData.category,
        state: formData.state,
        gender: formData.gender
      };

      const profileResponse = await api.updateProfile(profileData);
      
      // 2. Update local storage with user profile
      const localUser = localStorage.getItem('user');
      if (localUser) {
        const parsed = JSON.parse(localUser);
        parsed.profile = profileResponse.data.user.profile;
        localStorage.setItem('user', JSON.stringify(parsed));
      }

      // 3. Check Eligibility and get recommended schemes
      const response = await api.checkEligibility({
        age: parseInt(formData.age),
        income: parseFloat(formData.income),
        category: formData.category,
        state: formData.state,
        gender: formData.gender,
        uploadedDocuments: file ? [detectedDocType || "Aadhaar Card"] : []
      });

      navigate('/results', { state: { schemes: response.data.schemes } });
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.response?.data?.message || 'Failed to submit profile and verify eligibility. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="eligibility-page">
      {/* Animated Background */}
      <div className="bg-gradient"></div>
      
      <div className="container">
        <h1 className="page-title">{t('el_title')}</h1>
        <p className="page-subtitle">
          {t('el_subtitle')}
        </p>
      </div>

      <div className="content-grid">
        {/* Info Sidebar */}
        <div className="info-sidebar">
          <div className="info-card">
            <div className="info-card-icon">
              ⚡
            </div>
            <h3>{language === 'hi' ? 'स्मार्ट एआई ओसीआर' : 'Smart AI OCR'}</h3>
            <p>{language === 'hi' ? 'बिना टाइप किए उम्र और लिंग जैसे विवरणों को स्वचालित रूप से निकालने के लिए अपना आधार कार्ड डालें।' : 'Drop your Aadhaar Card to automatically extract details like Age and Gender without typing.'}</p>
          </div>

          <div className="info-card">
            <div className="info-card-icon">
              🔒
            </div>
            <h3>{language === 'hi' ? '100% एन्क्रिप्टेड' : '100% Encrypted'}</h3>
            <p>{language === 'hi' ? 'आपका दस्तावेज़ सुरक्षित रहता है। हम कड़े सुरक्षा मानकों के तहत आपके डेटा को संसाधित करते हैं।' : 'Your document stays safe. We process your data under strict security standards.'}</p>
          </div>

          <div className="info-card">
            <div className="info-card-icon">
              📊
            </div>
            <h3>{language === 'hi' ? 'व्यक्तिगत मिलान' : 'Personalized Match'}</h3>
            <p>{language === 'hi' ? 'अपने सटीक प्रोफ़ाइल के आधार पर योजनाओं, आवश्यक दस्तावेजों और स्वीकृति की संभावनाओं को दर्शाने वाला व्यक्तिगत डैशबोर्ड प्राप्त करें।' : 'Get a customized dashboard showing schemes, required documents, and approval odds based on your exact profile.'}</p>
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

            {successMsg && (
              <div className="alert alert-success">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/>
                  <path d="M6 10L9 13L14 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{successMsg}</span>
              </div>
            )}

            {/* Document Upload Zone */}
            <div className="form-section upload-section">
              <h3 className="section-title">{language === 'hi' ? 'ऑटोफिल के लिए आधार या आईडी स्कैन करें' : 'Scan Aadhaar or ID for Autofill'}</h3>
              
              <div className="form-group">
                <div 
                  className={`file-upload-area ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''} ${scanning ? 'scanning-active' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {scanning && (
                    <div className="ocr-scanner-overlay">
                      <div className="scanner-line"></div>
                      <div className="scanner-spinner"></div>
                      <p className="scanner-text">{language === 'hi' ? 'एआई आपका दस्तावेज़ पढ़ रहा है...' : 'AI is reading your document...'}</p>
                    </div>
                  )}

                  <input
                    type="file"
                    id="document"
                    className="file-input-hidden"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    disabled={scanning}
                  />
                  
                  <label htmlFor="document" className="file-upload-label">
                    {file ? (
                      <div className="file-selected">
                        <div className="file-icon">🪪</div>
                        <div className="file-info">
                          <p className="file-name">{file.name}</p>
                          <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                        {!scanning && (
                          <button 
                            type="button" 
                            className="file-remove"
                            onClick={(e) => {
                              e.preventDefault();
                              setFile(null);
                              setOcrSuccess(false);
                              setSuccessMsg('');
                            }}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="file-upload-content">
                        <div className="upload-icon">📤</div>
                        <p className="upload-text">
                          {language === 'hi' ? (
                            <><span className="upload-primary">आधार अपलोड करने के लिए क्लिक करें</span> या खींचें और छोड़ें</>
                          ) : (
                            <><span className="upload-primary">Click to upload Aadhaar</span> or drag & drop</>
                          )}
                        </p>
                        <p className="upload-hint">{language === 'hi' ? 'छवि प्रारूप समर्थित (अधिकतम 5MB)' : 'Image formats supported (Max 5MB)'}</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="modern-form">
                {/* Personal Information Section */}
                <div className="form-section">
                  <h3 className="section-title">{language === 'hi' ? 'नीचे दिए गए विवरणों को सत्यापित करें' : 'Verify Details Below'}</h3>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="age" className="form-label">
                        <span>{t('el_form_age')}</span>
                        <span className="required">*</span>
                        {autofilledFields.age && <span className="autofill-badge">{t('el_autofill_badge')}</span>}
                      </label>
                      <div className={`input-wrapper ${autofilledFields.age ? 'ocr-highlight' : ''}`}>
                        <input
                          type="number"
                          id="age"
                          name="age"
                          className="form-input"
                          placeholder={language === 'hi' ? 'अपनी उम्र दर्ज करें' : 'Enter your age'}
                          value={formData.age}
                          onChange={handleChange}
                          required
                          min="1"
                          max="120"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="gender" className="form-label">
                        <span>{t('el_form_gender')}</span>
                        <span className="required">*</span>
                        {autofilledFields.gender && <span className="autofill-badge">{t('el_autofill_badge')}</span>}
                      </label>
                      <div className={`input-wrapper ${autofilledFields.gender ? 'ocr-highlight' : ''}`}>
                        <select
                          id="gender"
                          name="gender"
                          className="form-input"
                          value={formData.gender}
                          onChange={handleChange}
                          required
                        >
                          <option value="">{language === 'hi' ? 'लिंग चुनें' : 'Select gender'}</option>
                          <option value="Male">{language === 'hi' ? 'पुरुष' : 'Male'}</option>
                          <option value="Female">{language === 'hi' ? 'महिला' : 'Female'}</option>
                          <option value="Other">{language === 'hi' ? 'अन्य' : 'Other'}</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="income" className="form-label">
                      <span>{t('el_form_income')}</span>
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
                    <p className="form-hint">{language === 'hi' ? 'अपने परिवार की कुल वार्षिक कमाई दर्ज करें' : 'Enter total yearly earnings for your family'}</p>
                  </div>
                </div>

                {/* Category & Location Section */}
                <div className="form-section">
                  <h3 className="section-title">{language === 'hi' ? 'श्रेणी और स्थान' : 'Category & Location'}</h3>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="category" className="form-label">
                        <span>{t('el_form_category')}</span>
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
                          <option value="">{language === 'hi' ? 'श्रेणी चुनें' : 'Select category'}</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="state" className="form-label">
                        <span>{t('el_form_state')}</span>
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
                          <option value="">{language === 'hi' ? 'राज्य चुनें' : 'Select state'}</option>
                          {states.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="submit-btn" disabled={loading || scanning}>
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      <span>{language === 'hi' ? 'प्रोफ़ाइल सहेज रहा है और मिलान जारी है...' : 'Saving Profile & Matching...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('el_btn_submit')}</span>
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
    );
  }

  export default CheckEligibility;