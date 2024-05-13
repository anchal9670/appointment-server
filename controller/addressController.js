const User = require('../models/userModel');
const Address = require('../models/addressModel');
const sendResponse = require('../utils/sendResponse');

const updateAddress = async (req, res) => {
    const userId = req.userId;
    const {
        addressType = 'Primary',
        apartment,
        area,
        city,
        state,
        pincode,
        country,
        phone,
    } = req.body;
    console.log(userId);

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if user already has an address
        if (!user.address) {
            // If no existing address, create a new one
            const newAddress = new Address({
                addressType,
                apartment,
                area,
                city,
                state,
                pincode,
                country,
                phone,
            });

            // Save the new address
            await newAddress.save();

            // Update the user's address reference
            user.address = newAddress._id;

            // Save the updated user
            await user.save();

            return res.json({ message: 'Address created successfully', address: newAddress });
        }

        // If user already has an address, update it
        const existingAddress = await Address.findById(user.address);

        if (!existingAddress) {
            return res.status(404).json({ error: 'Address not found for the user' });
        }

        existingAddress.set({
            addressType,
            apartment,
            area,
            city,
            state,
            pincode,
            country,
            phone,
        });

        // Save the updated address
        await existingAddress.save();

        return res.json({ message: 'Address updated successfully', address: existingAddress });
    } catch (error) {
        console.error(error);
        return sendResponse(res,500,'Internal Server Error');
    }
};


const showAddressDetails = async (req, res) => {
    const userId = req.query.userId;

    try {
        const user = await User.findById(userId).populate('address');

        if (!user) {
            return sendResponse(res,404,'User not found');
        }

        if (!user.address) {
            return sendResponse(res,404,'Address not found for the user');
        }

        return sendResponse(res,200,'Fetched Data Successfully',user.address)
    
    } catch (error) {
        console.error(error);
        return sendResponse(res,500,'Internal Server Error');
    }
};

module.exports = { updateAddress , showAddressDetails};
