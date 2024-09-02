require('dotenv').config();
const TOKEN = require("../utils/auth_related/token");
const logger = require("../utils/other/logger");
const usersQueryHelper = require("../models/user");
// const rolesQueryHelper = require("../query_helpers/roles_query_helper");


module.exports.validateAuthenticationToken = async (req, res, next) => {
    logger.info(`validateAuthenticationToken called()`);
    const bearerHeader = req.headers['authorization'];


    if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        let validate = await TOKEN.validateToken(bearerToken);
        if (validate) {
            req.user = validate;
            let key = validate.userDetails;
            let userDetails = await usersQueryHelper.getAlluserDetails(key);
            if (userDetails != null) {
                let status = userDetails.rows[0].status;
                if ([undefined, null, 'inactive'].includes(status)) {
                    return res.status(403).json({
                        status: `blocked`,
                        errMessage: `Account has been blocked by admin`,
                        statusCode: 403,
                    });
                }
                else {
                    req.user.key = userDetails.rows[0].key;
                 next();
                }
            } 
        }
        else {
            return res.status(403).json({
                status: `forbidden`,
                errMessage: `Token expired or invalid`,
                statusCode: 403,
            });
        }
    } else {
        // Forbidden
        return res.status(403).json({
            status: `forbidden`,
            errMessage: `Token not found`,
            statusCode: 403,
        });
    }
}

module.exports.checkIsAdmin = async (req, res, next) => {
    let { email, role_id } = req.user;
    let userDetails = await usersQueryHelper.getUserDetailsByUniqueKey({ email }, req.transaction);
    if (userDetails != null) {
        if (userDetails.role_id === role_id) {
            let roleDetails = await rolesQueryHelper.getRoleDetailsByUniqueKey({ key: role_id }, req.transaction);
            if (roleDetails != null) {
                if (roleDetails.role_name === 'Super Admin') {  
                    next();
                }
                else {
                    return res.status(403).json({
                        status: `unauthorized`,
                        errMessage: `Not authorized to perform this action`,
                        statusCode: 403
                    });
                }
            }
            else {
                return res.status(403).json({
                    status: `unauthorized`,
                    errMessage: `Not authorized to perform this action`,
                    statusCode: 403
                });
            }
        }
        else {
            return res.status(403).json({
                status: `unauthorized`,
                errMessage: `Not authorized to perform this action`,
                statusCode: 403
            });
        }
    }
    else {
        return res.status(403).json({
            status: `unauthorized`,
            errMessage: `Not authorized to perform this action`,
            statusCode: 403
        });
    }
}