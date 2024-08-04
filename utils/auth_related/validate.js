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