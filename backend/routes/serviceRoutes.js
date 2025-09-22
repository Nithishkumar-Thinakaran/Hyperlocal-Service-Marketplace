const express = require('express');
const router = express.Router();
const {
  createService,
  getAllServices,
  deleteService,
  updateService 
} = require('../controllers/serviceController');
const requireAuth = require('../middleware/requireAuth');

// Routes
router.post('/', requireAuth, createService);         
router.get('/', getAllServices);                      
router.delete('/:id', requireAuth, deleteService);   
router.put('/:id', requireAuth, updateService);       

module.exports = router;
