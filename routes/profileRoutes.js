const express = require('express');
const router = express.Router();
const profileController = require('../controller/profileController');
const {isAuth} = require('../middleware/auth');
const profileMiddleware = require('../middleware/Validation/profileValidation')

// Update user profile
router.patch('/profile/personal/update', profileMiddleware.updateProfileMiddleware , isAuth , profileController.updateProfile);
router.get('/profile/personal/show', isAuth , profileController.showPersonalProfile);
router.put('/kyc/update',profileMiddleware.updateKYCMiddleware , isAuth, profileController.updateKYC);
router.get('/kyc/show/:userId',profileMiddleware.showKYCMiddleware , profileController.showKYC );
router.post('/kyc/status/verified',profileMiddleware.kycVerifyRejectMiddleware , isAuth , profileController.verifyDocument);
router.post('/kyc/status/rejected',profileMiddleware.kycVerifyRejectMiddleware, isAuth , profileController.rejectDocument);

module.exports = router;
