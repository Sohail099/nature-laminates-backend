const logger = require('../utils/other/logger')
const dbUtil = require('../utils/db_related/dbUtil')
const fileName = 'searchModel.js';

module.exports.search = async (query) => {
    logger.info(`${fileName} search() called`);

    let sqlQuery = `
    SELECT * 
    FROM searchview 
    WHERE name ILIKE $1 
    ORDER BY name ASC;
    `;

    let data = [`%${query}%`];

    try {
        let result = await dbUtil.sqlToDB(sqlQuery, data);
        return result;
    } catch (error) {
        logger.error(`${fileName} search() ${error.message}`);
        throw new Error(error.message);
    }
}
