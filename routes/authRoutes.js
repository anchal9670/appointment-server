const express = require('express');
const router = express.Router();
const { signUp, logIn, sendOtp, mobileLogin, Refresh, changePassword, updateFCM } = require('../controller/authController');
const authMiddleware = require('../middleware/Validation/authValidation');
const {isAuth} = require('../middleware/auth');

// Register a new user
router.post('/signup', authMiddleware.signUpMiddleware, signUp);
router.post('/login', authMiddleware.logInMiddleware , logIn);
router.post('/sendOTP', authMiddleware.sendOtpMiddleware , sendOtp);
router.post('/phoneLogin',authMiddleware.mobileLoginMiddleware , mobileLogin);
router.get('/auth/refresh',Refresh);
router.post('/setting/changePassword', authMiddleware.changePasswordMiddleware , isAuth , changePassword);
router.post('/auth/updateFCM', authMiddleware.updateFCMMiddleware , updateFCM);

module.exports = router;
