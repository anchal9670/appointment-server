const express = require('express');
const router = express.Router();
const nutriController = require('../controller/nutritionistController');
const {isAuth} = require('../middleware/auth');
const nutriMiddleware = require('../middleware/Validation/nutritionistValidation');

// Update user profile
router.post('/nutrislot/add',isAuth, nutriController.createDefaultTimeSlots);
router.get('/nutrislot/show',isAuth , nutriController.showNutriSlot);
router.put('/nutrislot/update',nutriMiddleware.updateSlotMiddleware , isAuth , nutriController.updateAvailability);
router.post('/nutri/profile/add',nutriMiddleware.updateNutriProfileMiddleware , isAuth ,nutriController.updateNutriProfile);
router.get('/nutri/profile/show',nutriController.showNutriProfile);

module.exports = router;
