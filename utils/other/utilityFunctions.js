const crypto = require("crypto");
// const uuid = require("uuid");

exports.generatePasswordReset = () => {
	const resetPasswordToken = crypto.randomBytes(20).toString('hex');
	const resetPasswordTries = 1;
	return { resetPasswordToken, resetPasswordTries };
};

module.exports.addDays=(date, days)=>{
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

module.exports.removeDays=(date, days)=>{
    var result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
}

module.exports.getKeyByValue= async(object, value)=>
{
    return Object.keys(object).find(key => object[key] === value);
}
