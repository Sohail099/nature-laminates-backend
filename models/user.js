const logger = require('../utils/other/logger')
const dbUtil = require('../utils/db_related/dbUtil')
const fileName = ' userModel.js';
const {
    insertIntoTable,
    selectFromTable,
    updateTable,
    deleteRecordFromTable
} = require('../utils/db_related/queryUtil');


module.exports.checkColumnExists = async (
    tableName,
    columnName,
    checkValue,
    selectColumns
  ) => {
    logger.debug("checkColumnExists() called");
    let sqlQuery = selectFromTable(tableName, selectColumns);
    sqlQuery += `WHERE ${columnName}=$1`;
    let data = [checkValue];
    let client = await dbUtil.getTransaction();
    try {
     
      let result = await dbUtil.sqlExecSingleRow(client, sqlQuery, data);
      await dbUtil.commit(client); 
      return result;
    } catch (error) {
      logger.error(`Check columns error: ${error.message}`);
      await dbUtil.rollback(client);
      throw new Error(error.message);
    }
};

module.exports.RegisterUser = async(data,columns)=>{
    logger.info(`${fileName} RegisterUser is called()`);
    const tableName = "users";
    let sqlQuery = insertIntoTable(tableName,columns);
    sqlQuery += "  RETURNING * ";
    let client = await dbUtil.getTransaction();
    try {
        let result = await dbUtil.sqlExecSingleRow(client,sqlQuery,data);
        await dbUtil.commit(client)
        return result;
    } catch (error) {
        logger.info(`${fileName} registerUser ${error.message}`);
        await dbUtil.rollback(client);
        throw new Error(error.message);

    }
};

module.exports.logIn = async (inputEmail, selectColumns) => {
  const tableName = "users";
  let sqlQuery = selectFromTable(tableName, selectColumns);

  sqlQuery += "WHERE email=$1";
  let data = [inputEmail];
  let client = await dbUtil.getTransaction();
 
  try {
    let result = await dbUtil.sqlExecSingleRow(client, sqlQuery, data);
    await dbUtil.commit(client);
    return result;
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    await dbUtil.rollback(client);
    throw new Error(error.message);
  }
}; 

module.exports.updateUserDetails = async (columnsToUpdate,valuesForUpdate,key)=>
{
    logger.info(`${fileName} updateAdminSession() called`)
    let sqlQuery = updateTable("users",columnsToUpdate,"key");
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
        logger.error(`${fileName} updateAdminSession() ${error.message}`);
        await dbUtil.rollback(client);
        throw new Error(error.message);
    }
};