const mysql = require("mysql2");

//? conenction pool allow us to use multiple connections
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "node-complete",
    password: "root"
});

//? allows us to use promises when working with these conenctions which handles async tasks instead of callbacks
//? bcz promises allows us to write code in a bit more structured way. NO NESTED CALLBACKS(callback hell)
module.exports=pool.promise();


