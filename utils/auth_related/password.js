require('dotenv').config()
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const algorithm = process.env.ALGORITHM; //Using AES encryption

module.exports.encodePassword = async(password)=>
{
    let salt = await bcrypt.genSalt(10);
    let encodedPassword = await bcrypt.hash(password,salt);
    return encodedPassword
}

module.exports.checkPassword = async(password1, password2)=>
{
    // // console.log("P1 : ",password1);
    // // console.log("P2 : ",password2);
    let password=await bcrypt.compare(password1,password2)
        // ,async(err,same)=>
    // {
    //     if(err)
    //     {
    //         // console.log("not valid");
    //         password = false;
    //     }
    //     if(same)
    //     {
    //         // console.log("valid")
    //         // return true;
    //         password=true;
    //     }
    // })
    // // console.log(password);
    return password;
}

module.exports.encryptString = async(str) =>
{
    // console.log("encryptString() called");
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(str);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex'),key:key };
}

module.exports.decryptString = async(json) =>
{
    // console.log("decryptString() called");
    let iv = Buffer.from(json.iv, 'hex');
    let encryptedText = Buffer.from(json.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(json.key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}