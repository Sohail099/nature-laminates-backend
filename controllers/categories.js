const fileName = `controller-categories.js`;
const logger = require('../utils/other/logger');
const categoriesModel = require('../models/categories');
const productsModel = require("../models/products");
const errMessage = 'Something went wrong';
const successMessage = 'Successfully Done!';
const notFoundMessage = 'Requested resource not found';
const letterFormat = require("../utils/other/caseSensitive");
const { uploadImageToStorage, deleteDirectoryFromStorage } = require('../aws/awsStorageHelper');


module.exports.getAllCategories = async (req, res) => {
    try {
        logger.info(`${fileName} getAllCategories() called`);
        let { status, limit } = req.query;
        let categories = await categoriesModel.getAllCategories(status, limit);
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

module.exports.getListCategoryDropdown = async (req, res) => {
    try {
        logger.info(`${fileName} getListCategoryDropdown() called`);
        let { status } = req.query;
        let categories = await categoriesModel.getListCategoryDropdown(status);
        return res.status(200).json({
            status: `success`,
            message: successMessage,
            statusCode: 200,
            data: categories.rows
        })
    }
    catch (error) {
        logger.error(`${fileName} getListCategoryDropdown() ${error.message}`);
        return res.status(500).json({
            statusCode: 500,
            status: `error`,
            message: error.message
        })
    }
}

module.exports.getCategoryDetails = async (req, res) => {
    try {
        logger.info(`${fileName} getCategoryDetails() called`);
        let { categoryId } = req.params;
        let categoryDetails = await categoriesModel.getCategoryDetails(categoryId);
        if (categoryDetails.rowCount > 0) {
            return res.status(200).json({
                status: `success`,
                message: successMessage,
                statusCode: 200,
                data: categoryDetails.rows[0]
            })
        }
        else {
            return res.status(404).json({
                status: `not found`,
                message: notFoundMessage,
                statusCode: 404
            })
        }
    }
    catch (error) {
        logger.error(`${fileName} getCategoryDetails() ${error.message}`);
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
        let addedBykey = req.user.key;
        let files = req.files;
        let { name, description } = req.body;
        let columns = [
            "name",
            "description",
            "added_by"
        ];
        let inputName = letterFormat.formatString(name, false);
        let inputDescription = letterFormat.formatString(description)
        let values = [
            inputName,
            inputDescription,
            addedBykey
        ]
        let result = await categoriesModel.addCategory(columns, values);
        if (result.rowCount) {
            let details = result.rows[0];
            let updateColumns = [];
            let updateValues = [];
            for (let index = 0; index < files.length; index++) {
                const element = files[index];
                let filePath = `Categories/${details.key}/${element['fieldname']}`;
                let uploadResult = await uploadImageToStorage(filePath, element, details.key);
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
        let productToBeDeleted = await productsModel.getProductToBeDeletedList(key);
        let result = await categoriesModel.removeCategory(key);
        if (result.rowCount) {
            let filePath = `Categories/${key}`;
            let photo = result.rows[0]['photo'];
            if (photo != null) {
                await deleteDirectoryFromStorage(filePath);

            }
            if (productToBeDeleted.rows[0]['product_keys'] != null) {
                productToBeDeleted = productToBeDeleted.rows[0]['product_keys']
                for (let index = 0; index < productToBeDeleted.length; index++) {
                    let filePath = `Products/${productToBeDeleted[index]}`;
                    await deleteDirectoryFromStorage(filePath);
                }
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

module.exports.getAllCategoriesName = async (req, res) => {
    try {
        logger.info(`${fileName} getAllCategoriesName() called`);
        let categoryNames = await categoriesModel.getAllCategoryNames();
        let nameList = (categoryNames.rows[0].category_names != null) ? categoryNames.rows[0].category_names : []
        return res.status(200).json({
            status: 'success',
            message: successMessage,
            statusCode: 200,
            data: nameList
        });
    } catch (error) {
        logger.error(`${fileName} getAllCategoriesName() ${error.message}`);
        return res.status(500).json({
            statusCode: 500,
            status: 'error',
            message: error.message
        });
    }
}

module.exports.updateCategory = async (req, res) => {
    try {
        logger.info("updateCategory() called");
        let obj = req.body;
        let files = req.files;
        let categoryKey = obj.key;
        let restrictedFields = ['id', 'key', 'created_at', 'added_by'];

        for (let i = 0; i < restrictedFields.length; i++) {
            delete obj[restrictedFields[i]];
        }
        if (obj.name) {
            obj.name = letterFormat.formatString(obj.name, false);
        }
        if (obj.description) {
            obj.description = letterFormat.formatString(obj.description);
        }
        let updateColumns = [];
        let updateValues = [];
        if (files && files.length > 0) {
            for (let index = 0; index < files.length; index++) {
                const element = files[index];
                let filePath = `Categories/${categoryKey}/${element['fieldname']}`;
                let uploadResult = await uploadImageToStorage(filePath, element, categoryKey);
                if (uploadResult.status == true) {
                    updateColumns.push(element['fieldname']);
                    updateValues.push(uploadResult.url);
                } else {
                    return res.status(400).json({
                        status: `error`,
                        message: uploadResult.message,
                        statusCode: 400,
                        data: []
                    });
                }
            }
        }
        for (let [key, value] of Object.entries(obj)) {
            updateColumns.push(key);
            updateValues.push(value);
        }
        updateValues.push(categoryKey);
        let updateDetails = await categoriesModel.updateCategoryDetails(updateColumns, updateValues);
        if (updateDetails.rowCount > 0) {
            return res.status(200).json({
                status: `success`,
                message: `Category updated successfully`,
                statusCode: 200,
                data: updateDetails.rows
            });
        } else {
            return res.status(400).json({
                status: `error`,
                message: `Failed to update category`,
                statusCode: 400,
                data: []
            });
        }

    } catch (error) {
        logger.error(`updateCategory() ${error.message}`);
        return res.status(500).json({ status: 'error', message: error.message, statusCode: 500 });
    }
}