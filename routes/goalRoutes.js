const express = require('express');
const router = express.Router();
const { createOrUpdateGoal, getGoalData, updateBMITBW } = require('../controller/goalController');
const goalMiddleware = require('../middleware/Validation/goalValidation');
const {isAuth} = require('../middleware/auth');

router.put('/goal/update',goalMiddleware.createOrUpdateGoalMiddleware , isAuth, createOrUpdateGoal);
router.get('/goal/show',isAuth, getGoalData);
router.patch('/tbwbmi/update',goalMiddleware.updateBMITBWMiddleware , isAuth , updateBMITBW);

module.exports = router;
