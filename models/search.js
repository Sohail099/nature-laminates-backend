const logger = require('../utils/other/logger')
const dbUtil = require('../utils/db_related/dbUtil')
const fileName = 'searchModel.js';

module.exports.search = async (query) => {
    logger.info(`${fileName} search() called`);
    let data = []
    let sqlQuery = `
    SELECT * 
    FROM searchview`;
    if (query) {
        sqlQuery += " WHERE name ILIKE $1 ";
        data = [`%${query}%`];
    }
    sqlQuery += " ORDER BY name ASC ";

    try {
        let result = await dbUtil.sqlToDB(sqlQuery, data);
        return result;
    } catch (error) {
        logger.error(`${fileName} search() ${error.message}`);
        throw new Error(error.message);
    }
}
