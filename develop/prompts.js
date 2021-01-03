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
        name: "view",
        type: "rawlist",
        message: "What would you like to do?"
    }
];

const managers = [
    {
        name: "view",
        type: "rawlist",
        message: "Select a manager to view their supervisees."
    }
];

module.exports = {
    actions,
    departments,
    managers
};

