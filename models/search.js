const logger = require('../utils/other/logger')
const dbUtil = require('../utils/db_related/dbUtil');
const fileName = 'searchModel.js';

module.exports.search = async (query, status, source) => {
    logger.info(`${fileName} search() called`);
    let conditionCount = 0;
    let data = []
    let sqlQuery = `
    SELECT * 
    FROM search`;
    if (query) {
        conditionCount += 1;
        sqlQuery += ` WHERE name ILIKE '%${query}%' `;
    }
    if (status) {
        if (conditionCount) {
            sqlQuery += ` and status = '${status}' `
        }
        else {
            sqlQuery += ` WHERE status = '${status}' `;
        }
        conditionCount += 1
    }
    if (source) {
        if (conditionCount) {
            sqlQuery += ` and source = '${source}' `
        }
        else {
            sqlQuery += ` WHERE source = '${source}' `;
        }
        conditionCount += 1
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
