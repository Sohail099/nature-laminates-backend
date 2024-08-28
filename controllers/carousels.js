const fileName = `controller-carousels.js`;
const logger = require('../utils/other/logger');
const carouselsModel = require('../models/carousels.js');
const errMessage = 'Something went wrong';
const successMessage = 'Successfully Done!';
<<<<<<< HEAD
const firebaseStorageHelper = require("../firebase/firebaseStorageHelper")
const awsS3StorageHelper = require("../firebase/awsS3Storaeghelper");
=======
const { uploadImageToStorage, deleteDirectoryFromStorage } = require('../aws/awsStorageHelper.js');
>>>>>>> 0c03b3573dcd9ab46334720e1562e0d50ab1fcdc


module.exports.getAllCarousels = async (req, res) => {
    try {
        logger.info(`${fileName} getAllCarousels() called`);
        let carousels = await carouselsModel.getAllCarousels();
        return res.status(200).json({
            status: `success`,
            message: successMessage,
            statusCode: 200,
            data: carousels.rows
        })
    }
    catch (error) {
        logger.error(`${fileName} getAllCarousels() ${error.message}`);
        return res.status(500).json({
            statusCode: 500,
            status: `error`,
            message: error.message
        })
    }
}

module.exports.addCarousels = async (req, res) => {
    try {
        logger.info(`${fileName} addCarousles() called`);
        let files = req.files;
        let columns = [
            "name"
        ];
        let values = [
            files[0].originalname
        ]

        let result = await carouselsModel.addCarousels(columns, values);
        if (result.rowCount) {
            let details = result.rows[0];
            let updateColumns = [];
            let updateValues = [];
            for (let index = 0; index < files.length; index++) {
                const element = files[index];
                let filePath = `Carousels/${details.key}`;
<<<<<<< HEAD
                let uploadResult = await awsS3StorageHelper.uploadImageToS3Storage(filePath, element, details.key);
=======
                let uploadResult = await uploadImageToStorage(filePath, element, details.key);
>>>>>>> 0c03b3573dcd9ab46334720e1562e0d50ab1fcdc
                if (uploadResult.status) {
                    updateColumns.push(element['fieldname']);
                    updateValues.push(uploadResult.url);
                }
                else {
                    return res.status(400).json({
                        status: `error`,
                        message: uploadResult.message,
                        statusCode: 400,
                        data: []
                    })
                }
            }
            updateValues.push(details.key)
            let updateResult = await carouselsModel.updateCarouselsDetails(updateColumns, updateValues);
            if (updateResult.rowCount > 0) {
                return res.status(200).json({
                    status: `success`,
                    message: `New carousels added`,
                    statusCode: 200,
                    data: updateResult.rows[0]
                })
            }
            else {
                return res.status(400).json({
                    status: `error`,
                    message: errMessage + " while updating fields:" + updateColumns.join(", "),
                    statusCode: 400,
                    data: []
                })
            }
        }
        //If task is done and status is success and didn't got required data
        else {
            return res.status(400).json({
                status: `error`,
                message: errMessage,
                statusCode: 400,
                data: []
            })
        }
    }
    catch (error) {
        logger.error(`${fileName} addCarousles() ${error.message}`);
        return res.status(500).json({
            statusCode: 500,
            status: `error`,
            message: error.message
        })
    }
}

module.exports.removeCarousels = async (req, res) => {
    try {
        logger.info(`${fileName} removeCarousels() called`);
        let { key } = req.body;
        let result = await carouselsModel.removeCarousels(key);

        if (result.rowCount) {
            let filePath = `Carousels/${result.rows[0].key}`;
            await deleteDirectoryFromStorage(filePath);
            return res.status(200).json({
                status: `success`,
                message: `Carousel removed`,
                statusCode: 200,
                data: []
            })
        }
        //If task is done and status is success and didn't got required data
        else {
            return res.status(400).json({
                status: `error`,
                message: errMessage,
                statusCode: 400,
                data: []
            })
        }
    }
    catch (error) {
        logger.error(`${fileName} removeCarousels() ${error.message}`);
        return res.status(500).json({
            statusCode: 500,
            status: `error`,
            message: error.message
        })
    }
}