const express = require('express');
const router = express.Router();
const controller = require('../controller/appointmentController');
const {isAuth} = require('../middleware/auth');
const appointmentMiddleware = require('../middleware/Validation/appointmentValidation');


//add new designation by admin
router.post('/designation/add', appointmentMiddleware.designationMiddleware , isAuth , controller.createDesignation);
router.get('/designation/show',controller.showDesignation);

module.exports = router;