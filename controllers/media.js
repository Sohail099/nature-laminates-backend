const fileName = "controller-media.js";
const logger = require('../utils/other/logger');
const mediaModel = require('../models/media');
const errMessage = 'Something went wrong';
const successMessage = 'Successfully Done!';
const firebaseStorageHelper = require("../firebase/firebaseStorageHelper");

// module.exports.updateMedia = async(req,res)=>{
//     logger.info("updateMedia called ()");
//     try {

//         let obj = req.body
//         let files = req.files;
//         let mediaKey  = obj.key;
//         let firebaseAdmin = req.firebaseAdmin;

//         let restrictedKeyforUpdate = ['id','key','product_key','created_at','added_by']
//         for (let i = 0; i < restrictedKeyforUpdate.length; i++) {
//             delete obj[restrictedKeyforUpdate[i]];
//         }
//         // let columnsToUpdate = Object.entries(obj).map(([key, value]) => key);
//         // let valuesForUpdate = Object.entries(obj).map(([key, value]) => value);
        
//         for (let index = 0; index < files.length; index++) {
//             const element = files[index];
//             let filePath = `Product/${mediaKey}/${element['fieldname']}`;
           
//             let uploadResult = await firebaseStorageHelper.updateImageInStorage(firebaseAdmin, filePath, element, mediaKey);

//             console.log("see the upload reasutlssss**********",uploadResult)
            
//             let mediaColumns = [];
//             let mediaValues = [];

//             if (uploadResult.status) {
//                 mediaColumns.push("url", "product_key", "media_type", "name");
//                 mediaValues.push(uploadResult.url, details.key, element['mimetype'], element['originalname']);

//                 const updateResult = await mediaModel.updateMedia(mediaColumns, mediaValues,mediaKey);

//                 console.log("see the updated resule_+_+_+_++_+__+",updateResult);

//             }
//             else {
//                 return res.status(400).json({
//                     status: `error`,
//                     message: uploadResult.message,
//                     statusCode: 400,
//                     data: []
//                 })
//             }
//         }
        

//         let updateDetails = await mediaModel.updateMedia(columnsToUpdate, valuesForUpdate, mediaKey);

//         if (updateDetails.rowCount > 0) {
//             return res.status(200).json({
//                 status: `success`,
//                 message: successMessage,
//                 statusCode: 200,
//                 data: updateDetails.rows
//             })
//         } else {
//             return res.status(400).json({
//                 status: `error`,
//                 message: errMessage,
//                 statusCode: 400
//             })
//         }

//     } catch (error) {
//         logger.error(`${fileName} updatedProduct() ${error.message}`);
//         return res.status(500).json({ status: 'error', message: error.message, statusCode: 500 });
//     }


// }
