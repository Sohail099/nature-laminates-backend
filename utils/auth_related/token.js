require('dotenv').config()
const jwt = require('jsonwebtoken');
// const {createError} = require('create-error');

module.exports.generateToken  = async function(userDetails)
{
    // console.log("generateToken() called");
    // let secret = process.env.ACCESS_TOKEN_SECRET;
    let payload = {
        userDetails
    };
    let options ={
        issuer:"midlal.com",
        // key: userKey,
        expiresIn:'1m'
    };
    let access_token = await jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,options);
    // // console.log(access_token);
    return access_token
}

module.exports.generateTokenForPasswordReset  = async function(email, userKey)
{
    // console.log("generateToken() called");
    // let secret = process.env.ACCESS_TOKEN_SECRET;
    let payload = {
        key: userKey
    };
    let options = {
        issuer:"patron.com",
        audience: email,
        // key: userKey,
        expiresIn:'1d'
    };
    let access_token = await jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,options);
    // // console.log(access_token);
    return access_token
}

module.exports.generateRefreshToken = async(userDetails)=>
{
    // console.log("generateRefreshToken() called")

    let payload = {
        userDetails
    };
    let options ={
        issuer:"midlal.com",
        expiresIn:'1m'
    };
    let refreshToken=jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,options);
    return refreshToken;
}

module.exports.validateToken = async function(token)
{
    // console.log("validateToken() called")
    // // console.log("Token")
    let isValid = await new Promise((resolve, reject) =>{
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,async(err,decoded)=>
        {
            if(err)
            {
                // // console.log("Token Expired | ",err);
                // reject(false);
                resolve(false);
            }
            else
            {
                // // console.log("Token Valid | ",decoded);
                resolve(decoded);
            }
        })
    })
    // // console.log("isValid : ",isValid);
    return isValid;
}

module.exports.validateRefreshToken = async function(token)
{
    // console.log("validateRefreshToken() called")
    let isValid = await new Promise((resolve, reject) =>{
        jwt.verify(token,process.env.REFERESH_TOKEN_SECRET,async(err,valid)=>
        {
            if(err)
            {
                // // console.log("Token Expired | ",err);
                // reject(false);
                resolve(false);
            }
            else
            {
                // console.log("Token Valid | ",valid);
                resolve(valid);
            }
        })
    })
    return isValid;
}

