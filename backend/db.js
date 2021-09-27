const sql=require('mysql');
const pool=sql.createConnection({
    host:'localhost',
    port:3306,
    user:'root',
    password:'*************',
    connectionLimit:100,
    multipleStatements:true
});
module.exports=pool;
