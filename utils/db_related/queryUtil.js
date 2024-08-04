const insertIntoTable = (tableName, columns) => {

    let sqlQuery = `INSERT INTO "${tableName}" (`;

    for (let i = 0; i < columns.length; i++) {
        sqlQuery += columns[i];
        if (i != columns.length - 1) {
            sqlQuery += ", ";
        } else {
            sqlQuery += ") VALUES ( ";
        }
    }
    for (let i = 0; i < columns.length; i++) {
        sqlQuery += "$";
        sqlQuery += `${i + 1}`;
        if (i != columns.length - 1) {
            sqlQuery += ", ";
        } else {
            sqlQuery += ") ";
        }
    }
    return sqlQuery;
}

const updateTable = (tableName, columns, conditionKey) => {
    let query = [`UPDATE "${tableName}"`];
    query.push('SET');
    let set = [];
    for (let i = 0; i < columns.length; i++) {
        set.push(columns[i] + '=($' + (i + 1) + ')');
    }
    query.push(set.join(', '));
    let columnsCount = 1 + columns.length;
    query.push('WHERE ' + conditionKey + '=' + '$' + columnsCount);
    return query.join(' ');
}

const deleteRecordFromTable = (tableName, conditionKey, key) => {
    let query = `DELETE FROM "${tableName}" WHERE ${conditionKey}='${key}'`
    return query;
}

const selectFromTable = (tableName, selectColumns) => {
    let sqlQuery = "SELECT ";
    for (let i = 0; i < selectColumns.length; i++) {
        sqlQuery += selectColumns[i];
        if (i != selectColumns.length - 1) {
            sqlQuery += ", ";
        } else {
            sqlQuery += " FROM ";
            sqlQuery += `"${tableName}" `;
        }
    }
    return sqlQuery;
}

module.exports = {
    insertIntoTable,
    selectFromTable,
    updateTable,
    deleteRecordFromTable
};