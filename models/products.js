const logger = require('../utils/other/logger')
const dbUtil = require('../utils/db_related/dbUtil')
const {
    insertIntoTable,
    selectFromTable,
    updateTable,
    deleteRecordFromTable
} = require('../utils/db_related/queryUtil');
const fileName = 'productModel.js';

module.exports.getAllproducts = async (key) => {
    logger.info(`${fileName} getAllproducts() called`);
    let sqlQuery = `
    SELECT 
        p.*, 
        COALESCE(json_agg(
            json_build_object(
                'key', m.key,
                'product_key', m.product_key,
                'url', m.url,
                'media_type', m.media_type,
                'status', m.status,
                'name', m.name,
                'created_at', m.created_at,
                'updated_at', m.updated_at,
                'added_by', m.added_by
            )
        ) FILTER (WHERE m.key IS NOT NULL), '[]') AS media
    FROM 
        products p
    LEFT JOIN 
        media m ON m.product_key = p.key
    GROUP BY 
        p.key
    ORDER BY 
        p.key DESC;
`;
    let data = [];
    try {
        let result = await dbUtil.sqlToDB(sqlQuery, data);
        return result;
    }
    catch (error) {
        logger.error(`${fileName} getAllproducts() ${error.message}`);
        throw new Error(error.message);
    }
}


module.exports.addProducts = async (columns, values) => {
    logger.info(`${fileName} addProducts() called`)
    let sqlQuery = insertIntoTable("products", columns);
    sqlQuery += " returning *;"
    let client = await dbUtil.getTransaction();
    console.log("Query : ", sqlQuery);
    try {
        let result = await dbUtil.sqlExecSingleRow(client, sqlQuery, values);
        await dbUtil.commit(client);
        return result;
    }
    catch (error) {
        logger.error(`${fileName} addProducts() ${error.message}`);
        await dbUtil.rollback(client);
        throw new Error(error.message);
    }
}

module.exports.removeProduct = async (key) => {
    logger.info(`${fileName} removeProduct() called`)
    let sqlQuery = deleteRecordFromTable("products", "key", key);
    sqlQuery += " returning *;"
    let client = await dbUtil.getTransaction();
    try {
        let result = await dbUtil.sqlExecSingleRow(client, sqlQuery, []);
        await dbUtil.commit(client);
        return result;
    }
    catch (error) {
        logger.error(`${fileName} removeProduct() ${error.message}`);
        await dbUtil.rollback(client);
        throw new Error(error.message);
    }
}

module.exports.updateProduct = async (columnsToUpdate, valuesForUpdate, key) => {
    logger.info(`${fileName} updatedProduct() called`)
    let sqlQuery = updateTable("products", columnsToUpdate, "key");
    console.log()
    sqlQuery += ' returning *'
    let data = [...valuesForUpdate, key];
    let client = await dbUtil.getTransaction();
    try {
        let result = await dbUtil.sqlExecSingleRow(client, sqlQuery, data);
        await dbUtil.commit(client);
        return result;
    }
    catch (error) {
        logger.error(`${fileName} updatedProduct() ${error.message}`);
        await dbUtil.rollback(client);
        throw new Error(error.message);
    }
};

module.exports.getAllproductsByKey = async (column, value, status) => {
    logger.info(`${fileName} getAllproductsByKey() called`);
    let sqlQuery = selectFromTable("products", ["*"]);
    sqlQuery += ` where ${column}= $1`;

    if (status != null) {
        sqlQuery += ` AND status='${status}'`;
    }
    let data = [value];
    try {
        let result = await dbUtil.sqlToDB(sqlQuery, data);
        return result;
    }
    catch (error) {
        logger.error(`${fileName} getAllproductsByKey() ${error.message}`);
        throw new Error(error.message);
    }
}


module.exports.getProductToBeDeletedList = async (value) => {
    logger.info(`${fileName} getProductToBeDeletedList() called`);
    let sqlQuery = `select array_agg(key) as product_keys from products p where p.category_key = $1;`
    let data = [value];
    try {
        let result = await dbUtil.sqlToDB(sqlQuery, data);
        return result;
    }
    catch (error) {
        logger.error(`${fileName} getProductToBeDeletedList() ${error.message}`);
        throw new Error(error.message);
    }
}