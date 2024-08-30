const fileName = "controller-media.js";
const logger = require('../utils/other/logger');
const mediaModel = require('../models/media');
const errMessage = 'Something went wrong';
const successMessage = 'Successfully Done!';
const uuid = require('uuid');
const { uploadImageToStorage, deleteDirectoryFromStorage } = require('../aws/awsStorageHelper');


module.exports.addMedia = async (req, res) => {
    try {
        logger.info(`${fileName} addMedia() called`);
        let addedBykey = req.user.key;
        let files = req.files;
        let { productkey } = req.body;

        let resultsArray = [];
        for (let index = 0; index < files.length; index++) {
            const element = files[index];
            let mediaKey = uuid.v4();
            let mediaColumns = [];
            let mediaValues = [];
            mediaColumns.push("url", "product_key", "media_type", "name","added_by");

            let filePath = `Products/${productkey}/${mediaKey}`;
            let uploadResult = await uploadImageToStorage(filePath, element, mediaKey);
            if (uploadResult.status) {

                mediaValues.push(uploadResult.url, productkey, element['mimetype'], element['originalname'],addedBykey);
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

        let result = await mediaModel.removeMedia(key);
        if (result.rowCount) {
            let filePath = `Products/${result.rows[0]['key']}`;
            await deleteDirectoryFromStorage(filePath);
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
