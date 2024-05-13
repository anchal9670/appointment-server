const User = require('../models/userModel');
const KYC = require('../models/nutri_kycModel'); 
const sendResponse = require('../utils/sendResponse');

const updateProfile = async (req, res) => {
    try {
      const userId = req.userId;
      console.log(userId)
      const { name, dateOfBirth, gender, profilePic } = req.body;
      const updateFields = {};
      if (name) updateFields.name = name;
      if (dateOfBirth) updateFields.dateOfBirth = dateOfBirth;
      if (gender) updateFields.gender = gender;
      if (profilePic) updateFields.profilePic = profilePic;
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateFields, 
        { new: true }
      );
    
      if (!updatedUser) {
        return sendResponse(res,404,'User Not Found');
      }
  
      return sendResponse(res,200,'Updated Successfully',updateFields);
    } catch (error) {
      console.error(error);
      return sendResponse(res,500,'Internal Server Error');
    }
};

const showPersonalProfile = async(req,res)=>{
    try{
      const userId = req.userId;
      console.log(userId);
      const data = await User.findById(userId).select('-password -accountType -__v -goal -address -tbw -bmi');;

      return sendResponse(res,200,'Fetched Successfully',data);
    }catch(error){
      console.error(error);
      return sendResponse(res,500,'Internal Server Error');
    }
}


//update kyc for Nutritionists
const updateKYC = async (req, res) => {
    const {
        panNumber,
        panFrontImage,
        aadharNumber,
        aadharFrontImage,
        aadharBackImage,
        certificates,
    } = req.body;
    const userId = req.userId;

    try {
        let kyc = await KYC.findOne({ user: userId });

        if (!kyc) {
            // If KYC not found, create a new one
            kyc = new KYC({ user: userId });
        }
 
        const updateFields = {};

        // Build the update query dynamically based on provided parameters
        if (panNumber !== undefined && panFrontImage !== undefined) {
            updateFields.pan = { panNumber, frontImage : panFrontImage };
        }

        if (aadharNumber !== undefined && aadharFrontImage !== undefined && aadharBackImage !== undefined) {
            updateFields.aadhar = { aadharNumber, frontImage: aadharFrontImage, backImage: aadharBackImage };
        }

        if (certificates !== undefined) {
            updateFields.certificates = certificates;
        }

        // Update KYC with the dynamically built update query
        kyc.set(updateFields);
        await kyc.save();

        return sendResponse(res,200,'KYC update successfully');
    } catch (error) {
        console.error(error);
        return sendResponse(res,500,'Internal Server Error');
    }
};

const showKYC = async (req, res) => {
  const userId = req.params.userId;

  try {
    const kyc = await KYC.findOne({ user: userId });

    if (!kyc) {
        return sendResponse(res,404,'KYC not found for the user');
    }

    return sendResponse(res,200,'Fetched Successfully',kyc);
  } catch (error) {
      console.error(error);
      return sendResponse(res,500,'Internal Server Error');
  }
};

const verifiedKYC = async(req,res)=>{
  const userId = req.params.userId;
  const {status} = req.body;
  try{
    const kyc = await KYC.findOneAndUpdate(
      {user : userId },
      {
        status : status,
      },
      {new : true}
    );
    if (!kyc) {
      return sendResponse(res,404,'KYC not found for the user');
    }
    return sendResponse(res,200,'Fetched Successfully',kyc);
  }catch(error){
    console.error(error);
    return sendResponse(res,500,'Internal Server Error');
  }
}


// Controller for verifying a document
const verifyDocument = async (req, res) => {
  const { userId , documentType } = req.body;

  try {
    let kyc = await KYC.findOne({user : userId});
    if (!kyc) {
      return res.status(404).json({ message: 'KYC not found' });
    }

    // Update the document status
    switch (documentType) {
      case 'aadhar':
        kyc.aadhar.status = 'Verified';
        break;
      case 'pan':
        kyc.pan.status = 'Verified';
        break;
      case 'certificate':
        const certificateIndex = req.body.index; // assuming index is passed in the request body
        kyc.certificates[certificateIndex].status = 'Verified';
        break;
      default:
        return res.status(400).json({ message: 'Invalid document type' });
    }

    // Save the updated KYC
    await kyc.save();

    // Check if all documents are verified
    const allDocumentsVerified = kyc.aadhar.status === 'Verified' &&
                                  kyc.pan.status === 'Verified' &&
                                  kyc.certificates.every(certificate => certificate.status === 'Verified');

    if (allDocumentsVerified) {
      // Mark KYC as finally verified
      kyc.status = 'Verified';
      await kyc.save();
    }

    return res.status(200).json({ message: 'Document verified successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Controller for rejecting a document
const rejectDocument = async (req, res) => {
  const {userId , documentType } = req.body;
  try {
    let kyc = await KYC.findOne({user : userId});
    if (!kyc) {
      return res.status(404).json({ message: 'KYC not found' });
    }

    // Update the document status to Rejected
    switch (documentType) {
      case 'aadhar':
        kyc.aadhar.status = 'Rejected';
        break;
      case 'pan':
        kyc.pan.status = 'Rejected';
        break;
      case 'certificate':
        const certificateIndex = req.body.index; // assuming index is passed in the request body
        kyc.certificates[certificateIndex].status = 'Rejected';
        break;
      default:
        return res.status(400).json({ message: 'Invalid document type' });
    }

    // Save the updated KYC
    await kyc.save();

    // Check if any document is rejected
    const anyDocumentRejected = kyc.aadhar.status === 'Rejected' ||
                                 kyc.pan.status === 'Rejected' ||
                                 kyc.certificates.some(certificate => certificate.status === 'Rejected');

    if (anyDocumentRejected) {
      // Mark KYC as finally rejected
      kyc.status = 'Rejected';
      await kyc.save();
    }

    return res.status(200).json({ message: 'Document rejected successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { 
  updateProfile, 
  showPersonalProfile, 
  updateKYC, 
  showKYC,
  verifiedKYC,
  verifyDocument,
  rejectDocument
};