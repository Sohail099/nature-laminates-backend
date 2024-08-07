const fileName = "controller-media.js";
const logger = require('../utils/other/logger');
const mediaModel = require('../models/media');
const errMessage = 'Something went wrong';
const successMessage = 'Successfully Done!';
const firebaseStorageHelper = require("../firebase/firebaseStorageHelper");


module.exports.addMedia = async (req, res) => {
    try {
        logger.info(`${fileName} addMedia() called`);
        let files = req.files;
        let firebaseAdmin = req.firebaseAdmin;
        let { productkey } = req.body;
        let columns = [
            "product_key"
        ];
        let values = [
            productkey
        ]
       
            let mediaColumns = [];
            let mediaValues = [];
            for (let index = 0; index < files.length; index++) {
                const element = files[index];

//key ki jarurat
                let filePath = `Product/${details.key}/${element['fieldname']}`;
                let uploadResult = await firebaseStorageHelper.uploadImageToStorage(firebaseAdmin, filePath, element, details.key);
                if (uploadResult.status) {
                    mediaColumns.push("url", "product_key", "media_type", "name");
                    mediaValues.push(uploadResult.url, details.key, element['mimetype'], element['originalname']);

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

            let updateResult = await mediaModel.addMedia(mediaColumns, mediaValues);


            if (updateResult.rowCount > 0) {
                return res.status(200).json({
                    status: `success`,
                    message: `New media added`,
                    statusCode: 200,
                    data: result.rows[0],
                    data2: updateResult.rows[0]
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

    } catch (error) {
        logger.error(`${fileName} addMedia() ${error.message}`);
        return res.status(500).json({
            statusCode: 500,
            status: `error`,
            message: error.message
        })
    }
}