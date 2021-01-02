const mysql = require("mysql");
const inquirer = require("inquirer");
const { actions, departments, managers } = require("./develop/prompts");
const { queryEmployees, queryByDept, queryManagers, queryByManager } = require("./develop/queries");
const cTable = require('console.table');

// Create the connection information for the sql database
const connection = mysql.createConnection({
    host: "localhost",
    port: process.env.PORT || 3306,
    user: "root",
    password: "password",
    database: "employee_mngmt_db"
});

// Connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as id ", connection.threadId);
    start();
});

// Start the inquirer prompts, execute a different function based on user response
function start() {
    inquirer.prompt(actions).then((response) => {
      if (response.action === "View all employees") {
          viewEmployees();
      };

      if (response.action === "View all employees by department") {
          viewEmployeesByDept();
      };

      if (response.action === "View all employees by manager") {
        viewEmployeesByManager();
      }
       
    });
};

// Option #1, view all employees
function viewEmployees() {
    connection.query(queryEmployees, function(err, res) {
        if (err) throw err;
        console.log(res)
        console.table(res);
        start();
        //connection.end();
    });
};

// Option #2, view employees by dept
function viewEmployeesByDept() {
    inquirer.prompt(departments).then((response) => {
        connection.query(queryByDept, response.department, function(err, res) {
            if (err) throw err;
            console.table(res);
            start();
        });
    })
    
};

// Option #3, view employees by manager
function viewEmployeesByManager() {
    // Query to obtain a list of all managers
    connection.query(queryManagers, function (err, res) {
        let managerList = [];
        res.forEach((manager) => {
            managerList.push(manager.first_name)
        });
        
        // Create a choices key with a value set to the managerList array
        managers[0].choices = managerList;

        // Prompt the user to select a manager they would like to view supervisees for
        inquirer.prompt(managers).then((response) => {
            connection.query(queryByManager, response.manager, function(err, res) {
                if (err) throw err;
                console.table(res);
                start();
            });
        });
    });
};

