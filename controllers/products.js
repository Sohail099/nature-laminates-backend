const fileName = "controller-products.js";
const logger = require('../utils/other/logger');
const productsModel = require('../models/products');
const mediaModel = require('../models/media');
const errMessage = 'Something went wrong';
const successMessage = 'Successfully Done!';
const firebaseStorageHelper = require("../firebase/firebaseStorageHelper")

module.exports.addProduct = async (req, res) => {
    try {
        logger.info(`${fileName} addProduct() called`);
        let files = req.files;
        let firebaseAdmin = req.firebaseAdmin;
        let { name, categorykey, rating, productcode, dimension_unit, width, length, views, likes, price } = req.body;
        let columns = [
            "name",
            "category_key",
            "rating",
            "product_code",
            "dimension_unit",
            "width",
            "length",
            "views",
            "likes",
            "price"
        ];
        let values = [
            name, categorykey, rating, productcode, dimension_unit, width, length, views, likes, price
        ]
        let result = await productsModel.addProducts(columns, values);
        if (result.rowCount) {
            let details = result.rows[0];
            let mediaColumns = [];
            let mediaValues = [];
            for (let index = 0; index < files.length; index++) {
                const element = files[index];
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
                    message: `New product added`,
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
        } else {
            return res.status(400).json({
                status: `error`,
                message: errMessage,
                statusCode: 400,
                data: []
            })
        }

    } catch (error) {
        logger.error(`${fileName} addProduct() ${error.message}`);
        return res.status(500).json({
            statusCode: 500,
            status: `error`,
            message: error.message
        })
    }
}
module.exports.getAllProduct = async (req, res) => {
    try {
        logger.info(`${fileName} getAllProduct() called`);
        let products = await productsModel.getAllproducts();
        return res.status(200).json({
            status: `success`,
            message: successMessage,
            statusCode: 200,
            data: products.rows
        })
    }
    catch (error) {
        logger.error(`${fileName} getAllProduct() ${error.message}`);
        return res.status(500).json({
            statusCode: 500,
            status: `error`,
            message: error.message
        })
    }
}
module.exports.removeProducts = async (req, res) => {
    try {
        logger.info(`${fileName} removeProducts() called`);
        let { key } = req.body;
        let firebaseAdmin = req.firebaseAdmin;
        let result = await productsModel.removeProduct(key);
        if (result.rowCount) {
            let filePath = `Product/${result.rows[0]['key']}`;
            await firebaseStorageHelper.deleteDirectoryFromStorage(firebaseAdmin, filePath);
            return res.status(200).json({
                status: `success`,
                message: `product removed`,
                statusCode: 200,
                data: []
            })
        }
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
        logger.error(`${fileName} removeProducts() ${error.message}`);
        return res.status(500).json({
            statusCode: 500,
            status: `error`,
            message: error.message
        })
    }
}
module.exports.updateProduct = async (req, res) => {
    logger.info("updateProduct called ()");
    try {

        let obj = req.body
        let productkey = obj.key;

        let restrictedKeyforUpdate = ['id', 'key', 'created_at', 'added_by']
        for (let i = 0; i < restrictedKeyforUpdate.length; i++) {
            delete obj[restrictedKeyforUpdate[i]];
        }
        let columnsToUpdate = Object.entries(obj).map(([key, value]) => key);
        let valuesForUpdate = Object.entries(obj).map(([key, value]) => value);

        let updateDetails = await productsModel.updateProduct(columnsToUpdate, valuesForUpdate, productkey);

        if (updateDetails.rowCount > 0) {
            return res.status(200).json({
                status: `success`,
                message: successMessage,
                statusCode: 200,
                data: updateDetails.rows
            })
        } else {
            return res.status(400).json({
                status: `error`,
                message: errMessage,
                statusCode: 400
            })
        }

    } catch (error) {
        logger.error(`${fileName} updatedProduct() ${error.message}`);
        return res.status(500).json({ status: 'error', message: error.message, statusCode: 500 });
    }
}
