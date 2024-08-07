
const logger = require('../utils/other/logger')
const dbUtil = require('../utils/db_related/dbUtil')
const {
    insertIntoTable,
    selectFromTable,
    updateTable,
    deleteRecordFromTable
} = require('../utils/db_related/queryUtil');
const fileName = 'mediaModel.js';


module.exports.addMedia = async (columns, values) => {
    logger.info(`${fileName} addmedia() called`)
    let sqlQuery = insertIntoTable("media", columns);
    sqlQuery += " returning *;"
    let client = await dbUtil.getTransaction();
    console.log("Query : ", sqlQuery);
    try {
        let result = await dbUtil.sqlExecSingleRow(client, sqlQuery, values);
        await dbUtil.commit(client);
        return result;
    }
    catch (error) {
        logger.error(`${fileName} addmedia() ${error.message}`);
        await dbUtil.rollback(client);
        throw new Error(error.message);
    }
}

module.exports.removeMedia = async (key) => {
    logger.info(`${fileName} removeMedia() called`)
    let sqlQuery = deleteRecordFromTable("media", "key", key);
    sqlQuery += " returning *;"
    let client = await dbUtil.getTransaction();
    try {
        let result = await dbUtil.sqlExecSingleRow(client, sqlQuery, []);
        await dbUtil.commit(client);
        return result;
    }
    catch (error) {
        logger.error(`${fileName} removeMedia() ${error.message}`);
        await dbUtil.rollback(client);
        throw new Error(error.message);
    }
}