const logger = require('../utils/other/logger')
const dbUtil = require('../utils/db_related/dbUtil')
const {
    insertIntoTable,
    selectFromTable,
    updateTable,
    deleteRecordFromTable
} = require('../utils/db_related/queryUtil');
const fileName = 'categoriesModel.js';

module.exports.getAllCategories = async (status) => {
    logger.info(`${fileName} getAllCategories() called`);
    let sqlQuery = selectFromTable("categories", ["*"]);
    if (status != null) {
        sqlQuery += ` where status='${status}'`
    }
    sqlQuery += " order by id desc"
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