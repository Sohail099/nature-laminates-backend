
const userModel = require("../models/user");
const fileName = "controller-user.js";
const logger = require('../utils/other/logger');
const errMessage = 'Something went wrong';
const successMessage = 'Successfully Done!';
const validate = require("../utils/auth_related/validate");
const PASSWORD = require("../utils/auth_related/password");
const Token_Helper = require("../utils/auth_related/token");

const {userSchema,} = require("../utils/other/joi-validator");




module.exports.signUp = async (req, res) => {
    logger.debug(`${fileName} signup() called`);
    try {

        const columns = [
            "name",
            "email",
            "password",
            "access_token",
            "refresh_token",
            'photo',
            "status",
        ];

        const schema = userSchema();
        const { error, value } = schema.validate(req.body, {context: 'signup', abortEarly: false });
        if (error) {
            logger.error(`Signup error: ${JSON.stringify(error.details)}`);
            return res.status(400).json({ status: 'error', message: error.details.map(e => e.message), statusCode: 400 });
        } 
        const useremail = (req.body.email).toLowerCase();
        //cheack if email is already exist
        const EmailExists = (await userModel.checkColumnExists(tableName = "users", columnName = "email", checkValue = useremail, selectColumns = columns)).rows.length > 0; //++2 ceck
        if (EmailExists) {
            let errMsg = "email already exist";
            logger.error(`Signup error ${errMsg}`);
            return res.status(200).json({ status: 'error', message: errMsg, statusCode: 200 });
        }
        const password = await PASSWORD.encodePassword(req.body.password);    
        const new_access_token = await Token_Helper.generateToken(useremail);
        const new_refresh_token = await Token_Helper.generateRefreshToken(useremail);

        let emailVerified = true;

        if (emailVerified) {
            let data = [];

            for (let i = 0; i < columns.length; i++) {
                switch (columns[i]) {
                    case "password":
                        data.push(password);
                        break;
                    case "email":
                        data.push(useremail.trim());
                        break;
                    case "access_token":
                        data.push(new_access_token)
                        break;
                    case "refresh_token":
                        data.push(new_refresh_token)
                        break    
                    default:
                        data.push(req.body[columns[i]]);
                        break;
                }
            }

            let result = await userModel.RegisterUser(data, columns);
            return res.status(200).json({
                status: 'success',
                message: successMessage,
                statusCode: 200,
                data: result.rows[0]
            });
        }
        else {            
            logger.error(`Signup error: ${errMessage}`);
            return res.status(500).json({ status: 'error', message: errMessage, statusCode: 500 });
        }
    } catch (error) {
        logger.error(`Signup catch error: ${error.message}`);
        return res.status(500).json({ status: 'error', message: error.message, statusCode: 500 });
    }
}

module.exports.logIn = async (req, res) => {
    logger.info("logIn API called");
    try {
        const selectColumns = [ 
            "key",   
            "email",
            "name",
            "password",
            "access_token",
        ];
        const schema = userSchema();
        const { error, value } = schema.validate(req.body, {context: 'login', abortEarly: false });
        if (error) {
            logger.error(`login error: ${JSON.stringify(error.details)}`);
            return res.status(400).json({ status: 'error', message: error.details.map(e => e.message), statusCode: 400 });
        }
        let Email = (value["email"]).toLowerCase();
        let getUser = await userModel.logIn(Email, selectColumns);
        let user = getUser.rows[0];
        if (user == undefined) {
            let errorMsg = "Email dose not exist";
            logger.error(`Login error: ${errorMsg}`);
            return res.status(400).json({
                status: 'error',
                message: errorMsg,
                statusCode: 400
            });
        }
        const same = await PASSWORD.checkPassword(req.body.password, user.password)
        if (same) {
            const key = user["key"];
            const new_access_token = await Token_Helper.generateToken(Email, key);
            const new_refresh_token = await Token_Helper.generateRefreshToken(Email,key);
            const columnsToUpdate = [
                "access_token",
                "refresh_token"
            ];
            const valuesForUpdate = [
                new_access_token,
                new_refresh_token
            ]
            const details = await userModel.updateUserDetails(columnsToUpdate, valuesForUpdate, key)
            if (details.rowCount > 0) {
                return res.status(200).json({
                    status: `success`,
                    message: successMessage,
                    statusCode: 200,
                    data: details.rows[0]
                })
            }
            else {
                return res.status(400).json({
                    status: `error`,
                    message: errMessage,
                    statusCode: 400,
                    data: []
                })
            }
        }
        else {
            let errorMsg = "Incorrect Password";
            return res.status(400).json({ status: 'error', message: errorMsg, statusCode: 400 });
        }
    } catch (error) {
        logger.error(`Login error: ${error.message}`);
        return res.status(500).json({ status: 'error', message: error.message, statusCode: 500 });
    }
}

module.exports.validateToken = async (req,res)=>{
    logger.info("validateToken called ()");
    try {
    let access_token = req.headers["authorization"];
      if (access_token) {
        access_token = access_token.split(" ")[1];
        let verify = await Token_Helper.validateToken(access_token);
        if (verify) {  
            return res.status(200).json({
                status: 'sucess',
                message: "Token verified successfully",
                statusCode: 200
              })
        }
        else {
          return res.status(403).json({
            status: 'error',
            message: "Invalid Token",
            statusCode: 403
          })
        }
      }
      else {
        return res.status(403).json({
          status: 'error',
          message: " Access token not found",
          statusCode: 403
        })
      }   

    } catch (error) {
        logger.error(`validateToken error: ${error.message}`);
        return res.status(500).json({ status: 'error', message: error.message, statusCode: 500 });
    }
}

module.exports.logout = async (req, res) => {
    try {
        logger.info("logout api called()");
        let key = req.body.key;
        let columnsToUpdate = [
            "access_token",
            "refresh_token",      
        ]
        let valuesForUpdate = [
            null,
            null,
        ]
        let logout = await userModel.updateUserDetails(columnsToUpdate, valuesForUpdate,key)
        if (logout.rowCount > 0) {
            delete logout.rows[0]["password"];
            return res.status(200).json({
                status: `success`,
                message: `logout Successfully !`,
                statusCode: 200,
                data: logout.rows[0]
            })
        } else {
            return res.status(400).json({
                status: `error`,
                message: errMessage,
                statusCode: 400,
                data: []
            })
        }
    } catch (error) {
        logger.error(` logout  error: ${error.message}`);
        return res.status(500).json({ status: 'error', message: error.message, statusCode: 500 });
    }
}