//? NOTE: Squelize REQUIRES mysql2 TO BE INSTALLED FIRST 
//? Squelize is a ORM (Object Relational Mapper) its bascially means it handles all the SQL code behind
//? the scenes for us and maps it into javascript objects with convenient methods which we can all to execute
//? that "behind the secenes" SQL code so that we never have to write SQL code on our own.
const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'root', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;







//? NOTE: The below code is the same as the above code but with the difference that we are using the
// const mysql = require("mysql2");

// //? conenction pool allow us to use multiple connections
// const pool = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     database: "node-complete",
//     password: "root"
// });

// //? allows us to use promises when working with these conenctions which handles async tasks instead of callbacks
// //? bcz promises allows us to write code in a bit more structured way. NO NESTED CALLBACKS(callback hell)
// module.exports=pool.promise();