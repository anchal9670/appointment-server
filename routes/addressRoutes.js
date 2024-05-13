const express = require('express');
const router = express.Router();
const { showAddressDetails, updateAddress } = require('../controller/addressController');
const {isAuth} = require('../middleware/auth');
const address = require('../middleware/Validation/addressValidation');

router.post('/address/update', address.addressMiddleware , isAuth , updateAddress);
router.get('/address/show',isAuth, showAddressDetails);

module.exports = router;
