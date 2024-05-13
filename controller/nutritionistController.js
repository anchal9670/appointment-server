const ScheduleModel = require('../models/scheduleModel');
const DesignationFee = require('../models/designationFeeModel');
const Nutritionist = require('../models/nutritionistModel');
const User = require('../models/userModel');
const sendResponse = require('../utils/sendResponse');
const { date } = require('joi');

const createDefaultTimeSlots = async (req, res) => {
    const userId = req.userId; 

    try {
        const user = await ScheduleModel.findOne({userId:userId});
        if(user){
            return sendResponse(res,409,'Already Created');
        }
        const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        const timeSlots = generateTimeSlots();
        const schedule = new ScheduleModel({
            userId: userId,
        });

        // Create default time slots for each day
        daysOfWeek.forEach(day => {
            schedule[day] = timeSlots.map(time => ({ time, available: 'Not Available', appointment: 'No' }));
        });

        // Save the schedule to the database
        await schedule.save();

        return sendResponse(res,201,'Created Successfully');

    } catch (error) {
        console.error(error);
        return sendResponse(res,500,'Internal Server Error');
    }
};

// Helper function to generate time slots from 10:00 am to 8:00 pm with a 30-minute difference
const generateTimeSlots = () => {
    const timeSlots = [];
    let currentTime = new Date('2000-01-01T10:00:00'); // Arbitrary date, just for time manipulation

    while (currentTime < new Date('2000-01-01T20:00:00')) {
        timeSlots.push(currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    return timeSlots;
};

const showNutriSlot = async (req,res) =>{
    const userId = req.userId;
    try{
        const data = await ScheduleModel.findOne({userId:userId});
        if(!date){
            return sendResponse(res,200,'No Data Found');
        }
        return sendResponse(res,200,'Success',data);
    }catch(error){
        console.log(error);
        return sendResponse(res,500,'Internal Server Error');
    }
}

const updateAvailability = async (req, res) => {
    const userId = req.userId;
    const updates = req.body.updates; // Array of updates [{ day, time, available, appointment }, ...]

    try {
        let schedule = await ScheduleModel.findOne({ userId });

        if (!schedule) {
            return sendResponse(res,500,'Schedule not found.');
        }
      
        updates.forEach(({ day, time, available, appointment }) => {
            const updatedDay = schedule[day].map(slot => {
                if (slot.time === time) {
                    return { ...slot, available, appointment };
                }
                return slot;
            });

            schedule[day] = updatedDay;
        });

        await schedule.save();

        return sendResponse(res,200,'Availability updated successfully.');
    } catch (error) {
        console.error(error);
        return sendResponse(res,500,'Internal Server Error');
    }
};

const updateNutriProfile = async(req,res)=>{
    const userId = req.userId;
    const {designation , degree , description , practiceDate  } = req.body;
    try{
        const des = await DesignationFee.findOne({designation:designation});
        if(!des){
            return sendResponse(res,401,'Not Found Correct Designation');
        }
        let user = await User.findOne({_id:userId});
        if(user.accountType == 'User'){
            return sendResponse(res,401,'You are not Nutritionist');
        }
        if (!user.nutri) {
            const create = await Nutritionist.create({
                designation,
                degree,
                description,
                practice : practiceDate,
            });
            const update = await User.findOneAndUpdate(
                {_id : userId},
                {
                    nutri : create._id,
                },
                {new : true}
            );
            return sendResponse(res,201,'Nutritionist Created Successfully');
        }
        const update = await Nutritionist.findOneAndUpdate(
            {_id : user.nutri},
            {
                designation,
                degree,
                description,
                practice : practiceDate,
            }
        );

        return sendResponse(res,200,'Nutritionist Profesional Profile Updated Successfully');

    }catch(error){
        console.error(error);
        return sendResponse(res, 500, 'Internal Server Error');
    }
}

const showNutriProfile = async(req,res)=>{
    const userId = req.userId;
    try{
        const user = await User.findOne({_id :userId, accountType : "Nutri"});
        const nutri = await Nutritionist.findById({_id : user.nutri});
        if(!user){
            sendResponse(res,404,'Nutri Not found In DB');
        }
        return sendResponse(res,200,'Fetched Successfully',nutri);
    }catch(error){
        console.error(error);
        return sendResponse(res, 500, 'Internal Server Error');
    }
}


module.exports = {
    createDefaultTimeSlots,
    showNutriSlot,
    updateAvailability,
    updateNutriProfile,
    showNutriProfile,
};
