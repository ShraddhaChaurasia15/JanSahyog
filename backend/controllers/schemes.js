const express = require('express');
const router = express.Router();
const Scheme = require('../models/Scheme');


router.get('/', async (req, res) => {
  try {
    const schemes = await Scheme.find({ isActive: true }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: schemes.length,
      schemes
    });
  } catch (error) {
    console.error('Error fetching schemes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching schemes'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }

    res.json({
      success: true,
      scheme
    });
  } catch (error) {
    console.error('Error fetching scheme:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching scheme'
    });
  }
});


router.post('/', async (req, res) => {
  try {
    const scheme = await Scheme.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Scheme created successfully',
      scheme
    });
    
  } catch (error) {
    console.error('Error creating scheme:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating scheme'
    });
  }
});

module.exports = router;