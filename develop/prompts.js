const actions = [
    {
        name: "action",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
            "View all employees",
            "View all employees by department",
            "View all employees by manager",
            "Add employee",
            "Remove employee",
            "Update employee role",
            "View all roles",
            "Add role",
            "Remove role",
            "View all departments",
            "Add department"
        ]
    }
];

const departments = [
    {
        name: "department",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
            "Sales",
            "Engineering",
            "Finance",
            "Legal"
        ]
    }
];

const managers = [
    {
        name: "view",
        type: "rawlist",
        message: "Select a manager to view their supervisees."
    }
];

const newEmployee = [
    {
        name: "role",
        type: "list",
        message: "Select which role the new employee has.",
        choices: function() {
            var choiceArray = [];
            res.forEach(role => {
                choiceArray.push(role.title) 
             });
             return choiceArray;
             console.log(choiceArray)
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
        name: "department",
        type: "input",
        message: "Employee's last name"
    },
    {
        name: "manager",
        type: "rawlist",
        message: "Who will be the employee's manager?"
    }
];

module.exports = {
    actions,
    departments,
    managers,
    newEmployee
}

