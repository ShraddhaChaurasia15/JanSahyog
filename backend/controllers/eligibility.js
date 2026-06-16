const express = require('express');
const router = express.Router();
const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Check eligibility using AI service
router.post('/check', async (req, res) => {
  try {
    const { age, income, category, state, gender } = req.body;

    // Validate input
    if (!age || !income || !category || !state) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: age, income, category, and state'
      });
    }

    console.log('Checking eligibility with AI service:', { age, income, category, state, gender });

    // Call AI service
    const response = await axios.post(`${AI_SERVICE_URL}/api/check-eligibility`, {
      age: parseInt(age),
      income: parseFloat(income),
      category,
      state,
      gender: gender || null
    });

    console.log(`Found ${response.data.count} eligible schemes`);

    // Return the schemes from AI service
    res.json({
      success: true,
      count: response.data.count,
      schemes: response.data.schemes
    });

  } catch (error) {
    console.error('Eligibility check error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to check eligibility. Please try again.',
      error: error.response?.data?.detail || error.message
    });
  }
});

// Upload document for OCR
router.post('/ocr', async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a document'
      });
    }

    // Create form data for AI service
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    console.log('Processing OCR for:', req.file.originalname);

    // Call AI service OCR endpoint
    const response = await axios.post(`${AI_SERVICE_URL}/api/ocr`, formData, {
      headers: formData.getHeaders()
    });

    res.json({
      success: true,
      data: response.data.data
    });

  } catch (error) {
    console.error('OCR error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to process document. Please try again.',
      error: error.response?.data?.detail || error.message
    });
  }
});

module.exports = router;