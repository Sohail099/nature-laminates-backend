const fileName = "controller-media.js";
const logger = require('../utils/other/logger');
const mediaModel = require('../models/media');
const errMessage = 'Something went wrong';
const successMessage = 'Successfully Done!';
const firebaseStorageHelper = require("../firebase/firebaseStorageHelper");
const uuid = require('uuid');


module.exports.addMedia = async (req, res) => {
    try {
        logger.info(`${fileName} addMedia() called`);
        let files = req.files;
        let firebaseAdmin = req.firebaseAdmin;
        let { productkey } = req.body;

        let resultsArray = [];

        for (let index = 0; index < files.length; index++) {
            const element = files[index];
            let mediaKey = uuid.v4();
            let mediaColumns = [];
            let mediaValues = [];
            mediaColumns.push("url", "product_key", "media_type", "name");

            let filePath = `Product/${productkey}/${mediaKey}`;
            let uploadResult = await firebaseStorageHelper.uploadImageToStorage(firebaseAdmin, filePath, element, mediaKey);
            if (uploadResult.status) {

                mediaValues.push(uploadResult.url, productkey, element['mimetype'], element['originalname']);
                let mediaResult = await mediaModel.addMedia(mediaColumns, mediaValues);
                resultsArray.push(mediaResult);

            }

        }

        let rowsArray = resultsArray.map(result => result.rows);
        if (rowsArray.rowCount > 0) {
            return res.status(200).json({
                status: `success`,
                message: `New media added`,
                statusCode: 200,
                data: rowsArray.flat(),

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
        logger.error(`${fileName} addMedia() ${error.message}`);
        return res.status(500).json({
            statusCode: 500,
            status: `error`,
            message: error.message
        })
    }
}


module.exports.removeMedia = async (req, res) => {
    logger.info(`${fileName} removeMedia() called`);
    try {
        let { key } = req.body;

        let firebaseAdmin = req.firebaseAdmin;
        let result = await mediaModel.removeMedia(key);
        if (result.rowCount) {
            let filePath = `Product/${result.rows[0]['key']}`;
            await firebaseStorageHelper.deleteDirectoryFromStorage(firebaseAdmin, filePath);
            return res.status(200).json({
                status: `success`,
                message: `media removed`,
                statusCode: 200,
                data: []
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
        logger.error(`${fileName} removeProducts() ${error.message}`);
        return res.status(500).json({
            statusCode: 500,
            status: `error`,
            message: error.message
        })
    }
}
