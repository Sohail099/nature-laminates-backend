module.exports.validateEmail = function(email) 
{
    let mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(email.match(mailformat))
    {
        return true;
    }
    else
    {
        return false;
    }
}

module.exports.validateUsername = function(username)
{
    let usernameFormat = /^[a-zA-Z0-9]+$/;
    if(username.match(usernameFormat))
    {
        return true;
    }
    else
    {
        return false;
    }
}

const isEmail = email => {
    const emailRegEx = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]: (?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    if (email.match(emailRegEx)) {
      return true;
    } else return false;
  };
  


const isEmpty = (string) => {
      if (string.trim() === "") return true;
      else return false;
    };

exports.validateSignUpData = data =>{
    console.log("validate signupdata called()");
    let errors = "";
    if(isEmpty(data.name)) errors = "name mustnot be empty";
    else if(isEmpty(data.email)) errors = "email can not be empty";
    else if (!isEmail(data.email)) errors = "must be a valied email address";
    else if (isEmpty(data.password)) errors = "Password must not be empty"; 
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
      };
    
    }