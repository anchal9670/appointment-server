const DesignationFee = require('../models/designationFeeModel');
const Nutritionist = require('../models/nutritionistModel');
const User = require('../models/userModel');
const sendResponse = require('../utils/sendResponse');

const createDesignation = async (req, res) => {
    const { designation, fee, discount } = req.body;
    try {
        const formattedDesignation = designation.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());

        const existingDesignation = await DesignationFee.findOne({
            designation: formattedDesignation,
        });

        if (existingDesignation) {
            return sendResponse(res,409 , 'Designation already exists');
        }

        const create = await DesignationFee.create({
            designation: formattedDesignation,
            fee: fee,
            discount: discount,
        });

        return sendResponse(res, 201, 'Created Successfully');

    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, 'Internal Server Error');
    }
}

const showDesignation = async(req,res)=>{
    try{
        const data = await DesignationFee.find();
        return sendResponse(res,200,'Fetched Successfully', data);
    }catch(error){
        console.error(error);
        return sendResponse(res, 500, 'Internal Server Error');
    }
}

module.exports = {createDesignation , showDesignation};