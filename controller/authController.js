const otpGenerator = require("otp-generator");
require("dotenv").config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); 
const OTP = require('../models/otpModel');
const Token = require('../models/tokenModel');
const sendResponse = require('../utils/sendResponse');
const { signUpSchema } = require('../middleware/Validation/authValidation');
const twilio = require("twilio")(
    process.env.TWILIO_SID,
    process.env.TWILIO_TOKEN
);

// Function to register a new user
const signUp = async (req, res) => {
  try {
    const { email, password ,phone, name , accountType } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      phone,
      email,
      password: hashedPassword,
      accountType,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to login a user
const logIn = async (req, res) => {
  try {
    const { email, password , accountType = 'User'} = req.body;

    // Check if the user exists
    const user = await User.findOne({ email:email , accountType : accountType });
    if (!user) {
      return res.status(401).json({ message: 'Invalid Email' });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid Password' });
    }

    //refresh token
    const refreshToken = jwt.sign(
        {
            userId: user._id, 
            email: user.email,
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "1w" }
    );

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
        secure: true,
    });

    const expired_at = new Date();
    expired_at.setDate(expired_at.getDate() + 7);

    await Token.create({
        userId: user._id,
        token: refreshToken,
        expired_at,
    });

    const access_token = jwt.sign(
        {
            userId: user._id, 
            email: user.email,
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "60m" }
    );
    res.header("Authorization", `Bearer ${access_token}`);
    res.status(200).json({
        success: true,
        access_token : access_token,
        refresh_token: refreshToken,
        userId : user._id,
        message: "Logged in successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const sendOtp = async (req, res) => {
    try {
      const { phone , accountType = 'User'} = req.body;

      //check
      const existingUser = await User.findOne({ phone:phone , accountType : accountType });
      if (!existingUser) {
        return res.status(400).json({ message: 'Phone Number Not Found' });
      }
      //generate 5 digit otp
      var otp = "11111";
      console.log("otp generated successfully ", otp);
    //   let result = await OTP.findOne({ otp: otp });

    //   while (result) {
    //     otp = generateOTP();
    //     result = await OTP.findOne({ otp: otp });
    //   }
      console.log("otp generated successfully", otp);
      const otpPayload = {
        phone,
        otp,
      };
      //create entry in db
      const response = await OTP.create(otpPayload);
      //send otp
      // twilio.messages
      //   .create({
      //     from: process.env.TWILIO_PHONE_NUMBER,
      //     to: phone,
      //     body: `OTP for login ${otp}`,
      //   })
      //   .then((twilioRes) => {
      //     console.log("message has sent!", twilioRes);
      //     return res.status(200).json({
      //       success: true,
      //       messages: "OTP sent successfully",
      //       otp
      //     });
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     return res.status(500).json({
      //       messages: err.message || "Failed to send OTP",
      //       success: false,
      //     });
      //   });
  
      console.log("OTP generator", response);
      return res.status(200).json({
        success: true,
        messages: "OTP sent successfully",
        otp
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        messages: error.message || "Internal Server Error",
        success: false,
        error
      });
    }
};
  
function generateOTP() {
    return otpGenerator.generate(5, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });
}
  
//authentication
const mobileLogin = async (req, res) => {
    try {
      //get data
      const { phone, otp , accountType = 'User' } = req.body;
      // Validate data
      if (!otp ) {
        return res.status(403).json({
          success: false,
          message: "All fields are required",
        });
      }
  
      // Check recent OTP
      const recentOTP = await OTP.findOne({ phone }).sort({
        createdAt: -1,
      });
  
      if (!recentOTP || recentOTP.otp !== otp) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP",
        });
      }
  
   
    const user = await User.findOne({ phone : phone , accountType : accountType});
    // console.log(user);
    //refresh token
    const refreshToken = jwt.sign(
      {
          userId: user._id, 
          email: user.email,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "1w" }
    );

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
        secure: true,
    });

    const expired_at = new Date();
    expired_at.setDate(expired_at.getDate() + 7);

    await Token.create({
        userId: user._id,
        token: refreshToken,
        expired_at,
    });

    const access_token = jwt.sign(
        {
            userId: user._id, 
            email: user.email,
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "60m" }
    );
    res.header("Authorization", `Bearer ${access_token}`);
    res.status(200).json({
        success: true,
        access_token : access_token,
        refresh_token: refreshToken,
        userId : user._id,
        message: "Logged in successfully",
    });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "User authentication failed",
        error: error.message, // Log the specific error for debugging
      });
    }
  };
  
//refresh token
const Refresh = async (req, res) => {
    try {
      const refresh_token = req.cookies["refreshToken"] || req.header("refreshToken");
      const payload = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
  
      if (!payload) {
        return res.status(401).send({
          message: "unauthenticated payload",
        });
      }
  
      const dbToken = await Token.findOne({
        userId: payload.id,
        expired_at: { $gte: new Date() },
      });
  
      if (!dbToken) {
        return res.status(401).send({
          success: false,
          message: "unauthenticated db token",
        });
      }
  
      const access_token = jwt.sign(
        { id: payload.id },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "60m" }
      );
  
      return res.status(200).json({
        success: true,
        access_token,
        refresh_token,
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        error: error.message || "Internal Server Error",
      });
    }
};


const changePassword = async(req,res)=>{
  try{
    const userId = req.userId;
    console.log(userId);
    const {oldPassword , newPassword} = req.body;
    const user = await User.findById({_id:userId});
    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid  Old Password' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const update = await User.findOneAndUpdate(
      {_id : userId},
      {
        password : hashedPassword
      },
      {new : true}
    );

    return sendResponse(res , 200 , 'Updated Successfully', update);

  }catch(error){
    console.log(error);
    return sendResponse(res, 500,'Internal Server Error')
  }
}

const updateFCM = async(req,res)=>{
  try{
    const userId = req.userId;
    const {fcmToken} =req.body;

    const update = await User.findByIdAndUpdate(
      {userId},
      {
        fcm : fcmToken,
      },
      {new : true}
    );

    return sendResponse(res , 200 , 'Updated Successfully', update);

  }catch(error){
    return sendResponse(res, 500,'Internal Server Error');
  }
}

module.exports = { signUp, logIn , sendOtp, mobileLogin, Refresh , changePassword , updateFCM };
