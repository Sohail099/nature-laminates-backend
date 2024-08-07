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
    let sqlQuery = selectFromTable("products", ["*"]);
    sqlQuery += " order by id desc"
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

// module.exports.updateProdutDetails = async (columns, values) => {
//     logger.info(`${fileName} updateProdutDetails() called`)
//     let sqlQuery = updateTable("products", columns, "key");
//     sqlQuery += " returning *;"
//     let client = await dbUtil.getTransaction();
//     try {
//         let result = await dbUtil.sqlExecSingleRow(client, sqlQuery, values);
//         await dbUtil.commit(client);
//         return result;
//     }
//     catch (error) {
//         logger.error(`${fileName} updateProdutDetails() ${error.message}`);
//         await dbUtil.rollback(client);
//         throw new Error(error.message);
//     }
// }




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

module.exports.updateProduct = async (columnsToUpdate,valuesForUpdate,key)=>
{
    logger.info(`${fileName} updatedProduct() called`)
    let sqlQuery = updateTable("products",columnsToUpdate,"key");
    console.log()
    sqlQuery += ' returning *'
    let data = [...valuesForUpdate,key];
    let client = await dbUtil.getTransaction();
    try
    {
        let result = await dbUtil.sqlExecSingleRow(client,sqlQuery,data);
        await dbUtil.commit(client);
        return result;
    }
    catch(error)
    {
        logger.error(`${fileName} updatedProduct() ${error.message}`);
        await dbUtil.rollback(client);
        throw new Error(error.message);
    }
};