require("dotenv").config();
const ACCOUNT_SID = process.env.TWILIO_LIVE_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_LIVE_ACCOUNT_AUTH_TOKEN;
const SERVICE_ID = process.env.TWILIO_MIDLAL_PRO_SERVICE_SID;
const TWILIO = require('twilio')(ACCOUNT_SID,AUTH_TOKEN);
const usersModel = require("../../models/usersModel");
const logger = require("../other/logger");
const activityInformationController = require("../../controllers/controller-activityInformation.js");

module.exports.sendOTP = async(req,res)=>
{
    let number = req.body.number;
    try
    {
        logger.info("sendOTP() called")
        let response = await TWILIO.verify.v2.services(SERVICE_ID)
        .verifications
        .create({to: number, channel: 'sms'})
        .then(verification => {
            // console.log(verification)
            return verification;
        });
        activityInformationController.storeActivityInformation(key,"OTP sent for authentication", "Midlal Admin", null, true)
        return res.status(200).json(response);
    }
    catch(error)
    {
        logger.error(`error occured in sendOTP() error: ${error.message}`)
        return res.status(500).json({
            statusCode:500,
            status:`error`,
            message:error.message
        })
    }
}

module.exports.verifyOTP = async(req,res) => {
    logger.info("verifyOTP() called")
    try
    {
        let source = req.body.source;
        let code = req.body.code;
        let key = req.body.key;
        let response = await TWILIO.verify.v2.services(SERVICE_ID)
        .verificationChecks
        .create({to: source, code: code})
        .then(verification_check =>{
            console.log(verification_check)
            return verification_check;
        }).catch(err=>{
            console.log("Error VOTP : ",err);
        });
        if(response.valid)
        {
            const columns = [
                "is_verified",
                "updated_at"
            ];
            let values = [
                true,
                new Date().getTime()
            ]
            let userDetails= await usersModel.updateUserDetailsByKey(key,columns,values);
            if(userDetails.rowCount>0){
                activityInformationController.storeActivityInformation(
                    key,
                    `OTP successfully verified for profile verification`,
                    "Midlal Admin",
                    null,
                    true
                );
                delete userDetails.rows[0]["id"]
                delete userDetails.rows[0]["reset_token"]
                delete userDetails.rows[0]["password"]
                delete userDetails.rows[0]["password_iv"]
                delete userDetails.rows[0]["password_key"]
                return res.status(200).json({
                    statusCode:200,
                    status:'approved',
                    "data":userDetails.rows[0]
                });
            }
            else{
                return res.status(404).json({
                    statusCode:404,
                    message: 'user not found',
                    status:'error',
                    "data":[]
                });
            }
        } 
        else
        {
            return res.status(400).json({
                statusCode:400,
                message: 'Invalid OTP',
                status:'error',
                "data":[]
            });
        }
    }
    catch(error)
    {
        logger.error(`error occured in verifyOTP() error: ${error.message}`)
        return res.status(500).json({
            statusCode:500,
            status:`error`,
            message:error.message
        })
    }
}

module.exports.sendOTPViaEmail = async(email)=>
{
    try
    {
        logger.info("sendOTPViaEmail() called")
        let response = await TWILIO.verify.services(SERVICE_ID)
        .verifications
        .create({to: email, channel: ['email']})
        .then(verification => {
            return verification;
        });
        return response;
    }
    catch(error)
    {
        logger.error(`error occured in sendOTPViaEmail() error: ${error.message}`)
        return;
    }
}

module.exports.sendOTPviaPhoneforForgotPassword = async(phone)=>
{
    try
    {
        logger.info("sendOTPviaPhoneforForgotPassword() called")
        let response = await TWILIO.verify.services(SERVICE_ID)
        .verifications
        .create({to: phone, channel: 'sms'})
        .then(verification => {
            return true;
        }).catch(err=>{
            return false;
        });
        return response;
    }
    catch(error)
    {
        logger.error(`error occured in sendOTPviaPhoneforForgotPassword() error: ${error.message}`)
        return
    }
}