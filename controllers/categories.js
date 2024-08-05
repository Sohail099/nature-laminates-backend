const fileName = `controller-categories.js`;
const logger = require('../utils/other/logger');
const categoriesModel = require('../models/categories');
const errMessage = 'Something went wrong';
const successMessage = 'Successfully Done!';
const firebaseStorageHelper = require("../firebase/firebaseStorageHelper")


module.exports.getAllCategories = async (req, res) => {
    try {
        logger.info(`${fileName} getAllCategories() called`);
        let categories = await categoriesModel.getAllCategories();
        return res.status(200).json({
            status: `success`,
            message: successMessage,
            statusCode: 200,
            data: categories.rows
        })
    }
    catch (error) {
        logger.error(`${fileName} getAllCategories() ${error.message}`);
        return res.status(500).json({
            statusCode: 500,
            status: `error`,
            message: error.message
        })
    }
}

module.exports.addCategory = async (req, res) => {
    try {
        logger.info(`${fileName} addCategory() called`);
        let files = req.files;
        let firebaseAdmin = req.firebaseAdmin;
        let { name, description } = req.body;
        let columns = [
            "name",
            "description"
        ];
        let values = [
            name,
            description
        ]
        let result = await categoriesModel.addCategory(columns, values);
        if (result.rowCount) {
            let details = result.rows[0];
            let updateColumns = [];
            let updateValues = [];
            for (let index = 0; index < files.length; index++) {
                const element = files[index];
                let filePath = `Categories/${details.key}/${element['fieldname']}`;
                let uploadResult = await firebaseStorageHelper.uploadImageToStorage(firebaseAdmin, filePath, element, details.key);
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
            let updateResult = await categoriesModel.updateCategoryDetails(updateColumns, updateValues);
            if (updateResult.rowCount > 0) {
                return res.status(200).json({
                    status: `success`,
                    message: `New category added`,
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
        logger.error(`${fileName} addCategory() ${error.message}`);
        return res.status(500).json({
            statusCode: 500,
            status: `error`,
            message: error.message
        })
    }
}

module.exports.removeCategory = async (req, res) => {
    try {
        logger.info(`${fileName} removeCategory() called`);
        let { key } = req.body;
        let firebaseAdmin = req.firebaseAdmin;
        let result = await categoriesModel.removeCategory(key);
        if (result.rowCount) {
            let filePath = `Categories/${result.rows[0]['key']}`;
            let photo = result.rows[0]['photo'];
            if (photo != null) {
                await firebaseStorageHelper.deleteDirectoryFromStorage(firebaseAdmin, filePath);
            }
            return res.status(200).json({
                status: `success`,
                message: `Category removed`,
                statusCode: 200,
                data: result.rows[0]
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
        logger.error(`${fileName} removeCategory() ${error.message}`);
        return res.status(500).json({
            statusCode: 500,
            status: `error`,
            message: error.message
        })
    }
}