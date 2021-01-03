const mysql = require("mysql");
const inquirer = require("inquirer");
const { actions, departments, managers, newEmployee } = require("./develop/prompts");
const { queryEmployees, queryByDept, queryManagers, queryByManager, querySpecificRole, queryRoles, queryDepts, testQuery } = require("./develop/queries");
//const { Query } = require("./develop/constructors")
const cTable = require('console.table');
const { restart } = require("nodemon");


var list = []



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

Query.prototype.obtainInfoQuery = function (column, prompt) {
    //var column = column;
    connection.query(this.queryStr, function (err, res, fields) {
        var colName = fields[0].name
        let list = [];
        res.forEach((item) => {
            list.push(item.column)
        });

        // Create a choices key with a value set to the managerList array
        prompt[0].choices = list;
    })
};

// Create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: process.env.PORT || 3306,
    user: "root",
    password: "password",
    database: "employee_mngmt_db"
});

// Connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as id ", connection.threadId);
    start();
});

//managerList();

function getManger() {
    connection.query(queryManagers, function (err, res) {
        res.forEach((manager) => {
            list.push({ first_name: manager.first_name, id: manager.id })
            console.log("inside function", list)
        });
    });
};

console.log("outside function", list)



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

        if (response.action === "Add employee") {
            addEmployee();
        }

        if (response.action === "Remove employee") {
            removeEmployee();
        }

        if (response.action === "View all roles") {
            viewRoles();
        }

        if (response.action === "View all departments") {
            let viewDept = new Query(queryDepts);
            viewDept.initiateQuery();
        }

    });

};

// Option #1, view all employees
function viewEmployees() {
    connection.query(queryEmployees, function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
        //connection.end();
    });
};

// Option #2, view employees by dept
function viewEmployeesByDept() {
    inquirer.prompt(departments).then((response) => {
        connection.query(queryByDept, response.department, function (err, res) {
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
            if (managerList.includes(manager.first_name) === false) {
                managerList.push(manager.first_name)
            }; 
        });

        // Create a choices key with a value set to the managerList array
        managers[0].choices = managerList;

        // Prompt the user to select a manager they would like to view supervisees for
        inquirer.prompt(managers).then((response) => {
            connection.query(queryByManager, response.manager, function (err, res) {
                if (err) throw err;
                console.table(res);
                start();
            });
        });
    });
};

function addEmployee() {
    var query = "SELECT e.first_name, e.last_name, e.role_id, d.id AS department_id, r.title, e.manager_id, d.department_name FROM employees e RIGHT JOIN roles r ON e.role_id = r.id INNER JOIN departments d ON r.department_id = d.id"
    connection.query(query, function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "role",
                type: "rawlist",
                message: "Select which role the new employee has.",
                choices: function () {
                    var choiceArray = [];
                    res.forEach(role =>
                        choiceArray.push(role.title)
                    );
                    return choiceArray;
                }
            },
            {
                name: "firstName",
                type: "input",
                message: "Employee's first name"
            },
            {
                name: "lastName",
                type: "input",
                message: "Employee's last name"
            },
            {
                name: "manager",
                type: "rawlist",
                message: "Who will be the employee's manager?",
                choices: function () {
                    var choiceArray = ["N/A"];
                    res.forEach((manager) => {
                        
                        choiceArray.push(manager.first_name)
                    }
                    );
                    return choiceArray;
                }
            }
        ]).then((response) => {
            var employeeName = response.firstName
            var employeeLastName = response.lastName

            if (response.manager !== "N/A") {
                connection.query("SELECT id FROM roles WHERE title = ?", [response.role], function (err, res) {
                    var roleID = res[0].id;


                    connection.query("SELECT id FROM employees WHERE first_name = ?", [response.manager], function (err, res) {
                        var managerID = res[0].id;

                        connection.query("INSERT INTO employees SET ?",
                            {
                                first_name: employeeName,
                                last_name: employeeLastName,
                                role_id: roleID,
                                manager_id: managerID
                            }, 
                            function (err) {
                                console.log("Employee successfully added.")
                                start();
                            });
                    });
                });
            } else {
                connection.query("SELECT id FROM roles WHERE title = ?", [response.role], function (err, res) {
                    var roleID = res[0].id;

                    connection.query(
                        "INSERT INTO employees SET ?",
                        {
                            first_name: employeeName,
                            last_name: employeeLastName,
                            role_id: roleID
                        }, 
                        function (err) {
                            if (err) throw err;
                            console.log("Employee successfully added.")
                            start();
                        }
                    );
                });
            };
        });
    });
};

// Option #4, add employee
function addEmployeeOLD() {
    var newQuery = "SELECT e.first_name, e.role_id, d.id AS department_id FROM employees e INNER JOIN roles r ON e.role_id = r.id INNER JOIN departments d ON r.department_id = d.id";

    // var checkRoles = new Query(queryRoles);
    // checkRoles.obtainInfoQuery(title, newEmployee);
    connection.query(newQuery, function (err, res) {
        let list = [];
        console.log(res)
        res.forEach((role) => {
            list.push(role.title)
        });

        // Create a choices key with a value set to the managerList array
        newEmployee[0].choices = list;

        connection.query(queryManagers, function (err, res) {
            let managerList = ["N/A"];
            res.forEach((manager) => {
                managerList.push(manager.first_name)
            });

            // Create a choices key with a value set to the managerList array
            newEmployee[newEmployee.length - 1].choices = managerList;

            inquirer.prompt(newEmployee).then((response) => {
                connection.query(newQuery, response.manager, function (err, res) {
                    var manager_id = response.id


                    connection.query(queryByDept, function (err, res) {

                    })
                });
                // connection.query(queryAddEmployee, )
                // console.log(response)
            });
        });
    });



};

function managerLookUp() {
    connection.query(queryManagers, function (res, err) {
        let managerList = res;
    });
}

// Option #5, remove employee
function removeEmployee() {
    var query = "SELECT first_name, last_name FROM employees"
    connection.query(query, function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "employee",
                type: "rawlist",
                message: "Select which employee you would like to delete.",
                choices: function () {
                    var choiceArray = [];
                    res.forEach(employee => {
                        choiceArray.push(employee.first_name)
                    })
                    return choiceArray;
                }
            }
        ]).then((response) => {
            connection.query("DELETE FROM employees WHERE first_name = ?", [response.employee], function(err, res) {
                console.log("Succesfully deleted.")
                start();
            })
        })
        // inquirer.prompt("DELETE FROM employees WHERE first_name ? ")
    });

    


}
 

// Option #6, update employee role

// Option #7, update employee manager

// Option #8, view all roles
function viewRoles() {
    connection.query(queryRoles, function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
};

// Option #9, add role

// Option #10, remove role

// Option #12, add department

// Option #13, remove department


// let searchRole = new Query(querySpecificRole);

// let insertEmployee = new Query(queryAddEmployee);

// function addEmployee() {
//     searchRole.initiateQuery() 
// } 

module.exports = {
    start: start
}

