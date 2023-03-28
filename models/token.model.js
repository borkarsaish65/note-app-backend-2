const query = require("../db");
const {insertionColumnSet, insertionANDColumnSet,updateColumnSet} = require("./helper/queryHelper");

class tokenModel {

 tableName = 'activation_tokens';
 find = async(params,getColumn='*')=>{

    const {
        columnSet,
        values
    } = insertionANDColumnSet(params);

    let sql = `SELECT ${getColumn}  FROM ${this.tableName}  `;

    if(Object.keys(params).length > 0)
    {
        sql = sql + ' WHERE ' + columnSet;
    } 

   // console.log(sql,[...values])
    const result = await query(sql, [...values]);
    return result.rows;

 }
 createToken = async(params)=>{

    const { columnSet, fields, values } = insertionColumnSet(params)
    const sql = `INSERT INTO ${this.tableName}(${columnSet}) VALUES (${fields})`;
    console.log(sql,[...values])
    const result = await query(sql, [...values]);
    console.log(result,"<---")
    return result.rowCount;
}
 updateToken = async(setObject,whereObject)=>{

    const {
        columnSet,
        values, whereClause 
    } =updateColumnSet(setObject,whereObject);

    const sql = `UPDATE  ${this.tableName} SET ${columnSet} ${whereClause}`;
    const result = await query(sql, values);
    return result.rowCount;

 }


}


module.exports = new tokenModel;