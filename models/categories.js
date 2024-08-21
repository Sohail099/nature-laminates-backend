const logger = require('../utils/other/logger')
const dbUtil = require('../utils/db_related/dbUtil')
const {
    insertIntoTable,
    selectFromTable,
    updateTable,
    deleteRecordFromTable
} = require('../utils/db_related/queryUtil');
const fileName = 'categoriesModel.js';

module.exports.getAllCategories = async (status, limit) => {
    logger.info(`${fileName} getAllCategories() called`);
    let sqlQuery = selectFromTable("categories", ["*"]);
    if (status != null) {
        sqlQuery += ` where status='${status}'`;
    }
    sqlQuery += " order by id desc";
    if (limit != null) {
        sqlQuery += ` limit ${limit};`;
    }
    let data = [];
    try {
        let result = await dbUtil.sqlToDB(sqlQuery, data);
        return result;
    }
    catch (error) {
        logger.error(`${fileName} getAllCategories() ${error.message}`);
        throw new Error(error.message);
    }
}

module.exports.getListCategoryDropdown = async (status) => {
    logger.info(`${fileName} getListCategoryDropdown() called`);
    let sqlQuery = selectFromTable("categories", ["key", "name"]);
    if (status != null) {
        sqlQuery += ` where status='${status}'`;
    }
    sqlQuery += " order by name";
    let data = [];
    try {
        let result = await dbUtil.sqlToDB(sqlQuery, data);
        return result;
    }
    catch (error) {
        logger.error(`${fileName} getListCategoryDropdown() ${error.message}`);
        throw new Error(error.message);
    }
}

module.exports.getCategoryDetails = async (categoryId) => {
    logger.info(`${fileName} getCategoryDetails() called`);
    let sqlQuery = selectFromTable("categories", ["*"]);
    sqlQuery += ` where key='${categoryId}'`;
    let data = [];
    try {
        let result = await dbUtil.sqlToDB(sqlQuery, data);
        return result;
    }
    catch (error) {
        logger.error(`${fileName} getCategoryDetails() ${error.message}`);
        throw new Error(error.message);
    }
}

module.exports.addCategory = async (columns, values) => {
    logger.info(`${fileName} addCategory() called`)
    let sqlQuery = insertIntoTable("categories", columns);
    sqlQuery += " returning *;"
    let client = await dbUtil.getTransaction();
    console.log("Query : ", sqlQuery);
    try {
        let result = await dbUtil.sqlExecSingleRow(client, sqlQuery, values);
        await dbUtil.commit(client);
        return result;
    }
    catch (error) {
        logger.error(`${fileName} addCategory() ${error.message}`);
        await dbUtil.rollback(client);
        throw new Error(error.message);
    }
}

module.exports.updateCategoryDetails = async (columns, values) => {
    logger.info(`${fileName} updateCategoryDetails() called`)
    let sqlQuery = updateTable("categories", columns, "key");
    sqlQuery += " returning *;"
    let client = await dbUtil.getTransaction();
    try {
        let result = await dbUtil.sqlExecSingleRow(client, sqlQuery, values);
        await dbUtil.commit(client);
        return result;
    }
    catch (error) {
        logger.error(`${fileName} updateCategoryDetails() ${error.message}`);
        await dbUtil.rollback(client);
        throw new Error(error.message);
    }
}

module.exports.removeCategory = async (key) => {
    logger.info(`${fileName} removeCategory() called`)
    let sqlQuery = deleteRecordFromTable("categories", "key", key);
    sqlQuery += " returning *;"
    let client = await dbUtil.getTransaction();
    try {
        let result = await dbUtil.sqlExecSingleRow(client, sqlQuery, []);
        await dbUtil.commit(client);
        return result;
    }
    catch (error) {
        logger.error(`${fileName} removeCategory() ${error.message}`);
        await dbUtil.rollback(client);
        throw new Error(error.message);
    }
}

module.exports.getAllCategoryNames = async () => {
    logger.info(`${fileName} getAllCategoryNames() called`);

    let sqlQuery = `SELECT ARRAY_AGG(name ORDER BY name ASC) AS category_names FROM categories`;
    let data = [];
    try {
        let result = await dbUtil.sqlToDB(sqlQuery, data);
        return result;
    } catch (error) {
        logger.error(`${fileName} getAllCategoryNames() ${error.message}`);
        throw new Error(error.message);
    }
}
