const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    port: process.env.PORT || 3306,
    user: "root",
    password: "password",
    database: "employee_mngmt_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as id ", connection.threadId);
});
