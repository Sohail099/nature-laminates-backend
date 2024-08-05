const logger = require('../utils/other/logger')
const dbUtil = require('../utils/db_related/dbUtil')
const {
    insertIntoTable,
    selectFromTable,
    updateTable,
    deleteRecordFromTable
} = require('../utils/db_related/queryUtil');
const fileName = 'carouselsModel.js';

module.exports.getAllCarousels = async (key) => {
    logger.info(`${fileName} getAllCarousels() called`);
    let sqlQuery = selectFromTable("carousels", ["*"]);
    sqlQuery += " order by id desc"
    let data = [];
    try {
        let result = await dbUtil.sqlToDB(sqlQuery, data);
        return result;
    }
    catch (error) {
        logger.error(`${fileName} getAllCarousels() ${error.message}`);
        throw new Error(error.message);
    }
}

module.exports.addCarousels = async (columns, values) => {
    logger.info(`${fileName} addCasrousels() called`)
    let sqlQuery = insertIntoTable("carousels", columns);
    sqlQuery += " returning *;"
    let client = await dbUtil.getTransaction();
    console.log("Query : ", sqlQuery);
    try {
        let result = await dbUtil.sqlExecSingleRow(client, sqlQuery, values);
        await dbUtil.commit(client);
        return result;
    }
    catch (error) {
        logger.error(`${fileName} addCasrousels() ${error.message}`);
        await dbUtil.rollback(client);
        throw new Error(error.message);
    }
}

module.exports.updateCarouselsDetails = async (columns, values) => {
    logger.info(`${fileName} updateCarouselsDetails() called`)
    let sqlQuery = updateTable("carousels", columns, "key");
    sqlQuery += " returning *;"
    let client = await dbUtil.getTransaction();
    try {
        let result = await dbUtil.sqlExecSingleRow(client, sqlQuery, values);
        await dbUtil.commit(client);
        return result;
    }
    catch (error) {
        logger.error(`${fileName} updateCarouselsDetails() ${error.message}`);
        await dbUtil.rollback(client);
        throw new Error(error.message);
    }
}

module.exports.removeCarousels = async (key) => {
    logger.info(`${fileName} removeCarousels() called`)
    let sqlQuery = deleteRecordFromTable("carousels", "key", key);
    sqlQuery += " returning *;"
    let client = await dbUtil.getTransaction();
    try {
        let result = await dbUtil.sqlExecSingleRow(client, sqlQuery, []);
        await dbUtil.commit(client);
        return result;
    }
    catch (error) {
        logger.error(`${fileName} removeCarousels() ${error.message}`);
        await dbUtil.rollback(client);
        throw new Error(error.message);
    }
}