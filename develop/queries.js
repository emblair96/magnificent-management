const mysql = require("mysql");
//const { start } = require("../server.js");

var connection = mysql.createConnection({
    host: "localhost",
    port: process.env.PORT || 3306,
    user: "root",
    password: "password",
    database: "employee_mngmt_db"
});

function Query(queryStr) {
    this.queryStr = queryStr;
    // this.initiateQuery = connection.query(query, function (err, res) {
    //     if (err) throw err;
    //     console.table(res);
    // });
};

Query.prototype.initiateQuery = function () {
    connection.query(this.queryStr, function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
};



let queryEmployees = "SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.department_name FROM employees e INNER JOIN roles r ON e.role_id = r.id INNER JOIN departments d ON r.department_id = d.id ORDER BY id";

let queryByDept = "SELECT e.id AS employee_id, e.first_name, e.last_name, d.department_name, r.title FROM employees e INNER JOIN roles r ON e.role_id = r.id INNER JOIN departments d ON r.department_id = d.id WHERE department_name = ? ORDER BY e.id";

let queryManagers = "SELECT a.first_name, a.id FROM employees a INNER JOIN employees b ON a.id = b.manager_id";

let queryByManager = "SELECT a.id AS manager_id, a.first_name AS manager, b.first_name, b.last_name FROM employees a INNER JOIN employees b ON a.id = b.manager_id WHERE a.first_name = ?"; 

let querySpecificRole = "SELECT * FROM roles WHERE title = ?";

// let queryAddEmployee = "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";

let queryRoles = "SELECT title FROM roles";

let queryDepts = "SELECT * FROM departments";

let testQuery = "SELECT ? FROM ? WHERE ? = ?"

module.exports = {
    queryEmployees,
    queryByDept,
    queryManagers,
    queryByManager,
    querySpecificRole,
    queryRoles, 
    queryDepts,
    testQuery,
    Query
};