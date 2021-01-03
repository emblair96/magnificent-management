const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

const { actions, departments, managers, newEmployee } = require("./develop/prompts");
const { queryEmployees, queryByDept, queryManagers, queryByManager, querySpecificRole, queryRoles, queryDepts } = require("./develop/queries");
//const { Query } = require("./develop/constructors")


function Query(queryStr) {
    this.queryStr = queryStr;
};

Query.prototype.initiateQuery = function () {
    connection.query(this.queryStr, function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
};

Query.prototype.viewByQuery = function(prompt, newQuery) {
    connection.query(this.queryStr, function (err, res) {
        let list = [];
        res.forEach((item) => {
            if (list.includes(item.first_name) === false) {
                list.push(item.first_name)
            }; 
        });

        // Create a choices key with a value set to the managerList array
        prompt[0].choices = list;

        // Prompt the user to select a manager they would like to view supervisees for
        inquirer.prompt(prompt).then((response) => {
            connection.query(newQuery, response.view, function (err, res) {
                if (err) throw err;
                console.table(res);
                start();
            });
        });
    });
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

// Start the inquirer prompts, execute a different function based on user response
/*
function start() {
    inquirer.prompt(actions).then((response) => {
        switch(response.action) {
            case "View all employees":
                let viewEmployees = new Query(queryEmployees);
                viewEmployees.initiateQuery();
            default:
                console.log("something went wrong.");
                start();
        }
        
    });
}
*/

function start() {
    inquirer.prompt(actions).then((response) => {
        if (response.action === "View all employees") {
            let viewEmployees = new Query(queryEmployees);
            viewEmployees.initiateQuery();
        };


        if (response.action === "View all employees by department") {
            viewEmployeesByDept();
        };

        if (response.action === "View all employees by manager") {
            let viewEmployeesByManager = new Query(queryManagers);
            viewEmployeesByManager.viewByQuery(managers, queryByManager);

        }

        if (response.action === "Add employee") {
            addEmployee();
        }

        if (response.action === "Remove employee") {
            removeEmployee();
        }

        if (response.action === "Update employee role") {
            updateRole()
        }

        if (response.action === "View all roles") {
            let viewRoles = new Query(queryRoles);
            viewRoles.initiateQuery();
        }

        if (response.action === "Add role") {
            addRole();
        }

        if (response.action === "Remove role") {
            removeRole();
        }

        if (response.action === "View all departments") {
            let viewDepts = new Query(queryRoles);
            viewDepts.initiateQuery();
        }

        if (response.action === "Add department") {
            addDept();
        }

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
                console.log("Succesfully deleted.");
                start();
            });
        });
    });
};
 
// Option #6, update employee role
function updateRole() {
    connection.query("SELECT first_name, id FROM employees", function (err, res) {
        if (err) {
            console.log(err.sqlMessage)
        }
        inquirer.prompt([
            {
                name: "employee",
                type: "rawlist",
                message: "Select which employee you would like to update.",
                choices: function () {
                    var choiceArray = [];
                    res.forEach(employee => {
                        choiceArray.push(employee.first_name)
                    })
                    return choiceArray;
                }
            },
            {
                name: "role",
                type: "input",
                message: "What is the new title of their role?"
            }
        ]).then((response) => {
            var employeeName = response.employee;
            connection.query("SELECT id FROM roles WHERE title = ?", [response.role], function(err, res) {
                if (err) {
                    console.log(err.sqlMessage)
                    start();
                }
                console.log(res)
                connection.query("UPDATE employees SET ? WHERE ?", 
                [
                {
                    role_id: res[0].id
                },
                {
                    first_name: employeeName
                }
                ], function(err, res) {
                    console.log("Role successfully updated.")
                    start();
                });
            })
        });
    });
}

// Option #9, add role
function addRole() {
    connection.query("SELECT department_name FROM departments", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "role",
                type: "input",
                message: "What is the title of the role you would like to add?",
            },
            {
                name: "dept",
                type: "rawlist",
                message: "What department should this role be in?",
                choices: function () {
                    var choiceArray = [];
                    res.forEach(dept => {
                        choiceArray.push(dept.department_name)
                    })
                    return choiceArray;
                }
            },
            {
                name: "salary",
                type: "input",
                message: "What is this role's annual salary?",
            },
        ]).then((response) => {
            var roleTitle = response.role;
            var salaryAmt = response.salary;
            connection.query("SELECT id FROM departments WHERE department_name = ?", [response.dept], function(err, res) {
                if (err) {
                    console.log(err.sqlMessage)
                    start();
                }  
                var deptID = res[0].id;
                connection.query("INSERT INTO roles SET ?",
                {
                    title: roleTitle,
                    salary: salaryAmt,
                    department_id: deptID
                }, 
                function(err, res) {
                    if (err) {
                        console.log(err.sqlMessage);
                    } else {
                        console.log("Succesfully added.");
                    }
                    start();
                });
            })
            
        });
    });      
};

// Option #10, remove role
function removeRole() {
    var query = "SELECT title FROM roles"
    connection.query(query, function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "role",
                type: "rawlist",
                message: "Select which role you would like to delete.",
                choices: function () {
                    var choiceArray = [];
                    res.forEach(role => {
                        choiceArray.push(role.title)
                    })
                    return choiceArray;
                }
            }
        ]).then((response) => {
            connection.query("DELETE FROM roles WHERE title = ?", [response.role], function(err, res) {
                if (err) {
                    console.log(err.sqlMessage);
                } else {
                    console.log("Succesfully deleted.");
                }
                start();
            });
        });
    });
};

// Option #12, add department
function addDept() {
    inquirer.prompt([
        {
            name: "dept",
            type: "input",
            message: "What is the name of the department you would like to add?",
        }
    ]).then((response) => {
        connection.query("INSERT INTO departments (department_name) VALUES (?)", [response.dept], function(err, res) {
            if (err) {
                console.log(err.sqlMessage)
                start();
            }
            console.log("Department successfully added.")
            start();
        })
    })
}

// Option #13, remove department
