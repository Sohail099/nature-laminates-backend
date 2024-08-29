const fileName = "controller-products.js";
const logger = require('../utils/other/logger');
const productsModel = require('../models/products');
const mediaModel = require('../models/media');
const errMessage = 'Something went wrong';
const successMessage = 'Successfully Done!';
const letterFormat = require("../utils/other/caseSensitive");
const uuid = require('uuid');
const { uploadImageToStorage, deleteDirectoryFromStorage } = require('../aws/awsStorageHelper');


module.exports.addProduct = async (req, res) => {
    try {
        logger.info(`${fileName} addProduct() called`);
        let files = req.files;
        let { name, categorykey, product_code, dimension_unit, width, length, price, description } = req.body;
        let columns = [
            "name",
            "category_key",
            "description",
            "product_code",
            "dimension_unit",
            "width",
            "length",
            "price"
        ];
        let inputName = letterFormat.formatString(name, false);
        let inputDescription = letterFormat.formatString(description)

        let values = [
            inputName, categorykey, inputDescription, product_code, dimension_unit, width, length, price
        ]
        let result = await productsModel.addProducts(columns, values);
        if (result.rowCount) {
            let details = result.rows[0];
            for (let index = 0; index < files.length; index++) {
                const element = files[index];
                let mediaKey = uuid.v4();
                let mediaColumns = [];
                let mediaValues = [];
                mediaColumns.push("key", "url", "product_key", "media_type", "name");
                let filePath = `Products/${details.key}/${mediaKey}`;
                let uploadResult = await uploadImageToStorage(filePath, element, mediaKey);
                console.log("see file upload",uploadResult);

                if (uploadResult.status) {
                    mediaValues.push(mediaKey, uploadResult.url, details.key, element['mimetype'], element['originalname']);
                    await mediaModel.addMedia(mediaColumns, mediaValues)
                }
            }
            return res.status(200).json({
                status: `success`,
                message: successMessage,
                statusCode: 200,
                data: result.rows
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
        let result = await productsModel.removeProduct(key);
        if (result.rowCount) {
            let filePath = `Products/${result.rows[0]['key']}`;
            await deleteDirectoryFromStorage(filePath);
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

        if (obj.name) {
            obj.name = letterFormat.formatString(obj.name, false);
        }
        if (obj.description) {
            obj.description = letterFormat.formatString(obj.description);
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
module.exports.getAllProductByCategorieKey = async (req, res) => {
    logger.info(`${fileName} getAllProductByCategorieKey() called`);

    try {
        let categoriesKey = req.params.categoryId;
        let { status } = req.query;
        let products = await productsModel.getAllproductsByKey("category_Key", categoriesKey, status);
        return res.status(200).json({
            status: `success`,
            message: successMessage,
            statusCode: 200,
            data: products.rows
        })
    }
    catch (error) {
        logger.error(`${fileName} getAllProductByCategorieKey() ${error.message}`);
        return res.status(500).json({
            statusCode: 500,
            status: `error`,
            message: error.message
        })
    }
}
module.exports.getAllProductByProductKey = async (req, res) => {
    logger.info(`${fileName} getAllProductByProductKey() called`);
    try {
        let { key } = req.params;
        let products = await productsModel.getAllproductsByKey("key", key);
        if (products.rowCount > 0) {
            return res.status(200).json({
                status: `success`,
                message: successMessage,
                statusCode: 200,
                data: products.rows[0]
            })
        } else {
            return res.status(404).json({
                status: `error`,
                message: `No product found`,
                statusCode: 404,
                data: []
            })
        }

    }
    catch (error) {
        logger.error(`${fileName} getAllProductByProductKey() ${error.message}`);
        return res.status(500).json({
            statusCode: 500,
            status: `error`,
            message: error.message
        })
    }
}


module.exports.getAllProductName = async (req, res) => {
    try {
        logger.info(`${fileName} getAllProductName() called`);
        let productNames = await productsModel.getAllProductNames();
        let nameList = (productNames.rows[0].products_names != null) ? productNames.rows[0].products_names : []
        return res.status(200).json({
            status: 'success',
            message: successMessage,
            statusCode: 200,
            data: nameList
        });
    } catch (error) {
        logger.error(`${fileName} getAllProductName() ${error.message}`);
        return res.status(500).json({
            statusCode: 500,
            status: 'error',
            message: error.message
        });
    }
}
