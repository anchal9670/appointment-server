const Goal = require('../models/goalModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const sendResponse = require('../utils/sendResponse');

const createOrUpdateGoal = async (req, res) => {
    try {
        const userId = req.userId;

        const goalData = req.body;

        // Check if the user exists
        console.log(userId);
        console.log(goalData);
        const userExists = await User.findById(userId);
        if (!userExists) {
            return sendResponse(res, 404, 'User Not Found');
        }

        // Retrieve the user's goal ID from the user model
        const userGoalId = userExists.goal;
        console.log(userGoalId);
        // If the user has an associated goal, update it; otherwise, create a new goal
        if (userGoalId) {
            const updatedGoal = await Goal.findByIdAndUpdate(
                userGoalId,
                { $set: goalData },
                { new: true }
            );
            return sendResponse(res, 200, 'Update Successfully', updatedGoal);
        } else {
            const newGoal = new Goal(goalData);
            const savedGoal = await newGoal.save();

            // Update the user model with the new goal ID
            const update = await User.findOneAndUpdate(
                {_id : userId},
                {
                    goal : savedGoal._id,
                },
                {new : true}
            );

            return sendResponse(res, 201, 'Created Successfully', savedGoal);
        }
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, 'Internal Server Error');
    }
};

const getGoalData = async (req, res) => {
    try {
        const userId = req.userId;

        // Fetch the user
        const user = await User.findById(userId);

        if (!user) {
            return sendResponse(res, 404, 'User Not Found');
        }

        // Retrieve the user's goal ID from the user model
        const userGoalId = user.goal;

        // If the user has an associated goal, fetch and return the goal data
        if (userGoalId) {
            const userGoal = await Goal.findById(userGoalId);

            if (!userGoal) {
                return sendResponse(res, 404, 'Goal Data Not Found');
            }

            return sendResponse(res, 200, 'Goal Data Retrieved Successfully', userGoal);
        } else {
            return sendResponse(res, 404, 'Goal Data Not Found');
        }
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, 'Internal Server Error');
    }
};

const updateBMITBW = async(req,res)=>{
    try{
        const userId = req.userId;
        const {value , type} = req.body;
        // Fetch the user
        const user = await User.findById(userId);

        if (!user) {
            return sendResponse(res, 404, 'User Not Found');
        }
        if(type === 'BMI'){
            const update = await User.findByIdAndUpdate(
                {_id : userId},
                {
                    bmi : value,
                },
                {new : true}
            );
            return sendResponse(res, 200, 'Update Successfully');
        }else if(type === 'TBW'){
            const update = await User.findOneAndUpdate(
                {_id : userId},
                {
                    tbw : value,
                },
                {new : true}
            );
            return sendResponse(res, 200, 'Update Successfully');
        }else {
            return sendResponse(res, 404, 'Type Not Found');
        }

    }catch(error){
        console.error(error);
        return sendResponse(res, 500, 'Internal Server Error');
    }
}

module.exports = {
    createOrUpdateGoal,
    getGoalData,
    updateBMITBW
};
