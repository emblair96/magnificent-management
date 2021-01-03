const mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: process.env.PORT || 3306,
    user: "root",
    password: "password",
    database: "employee_mngmt_db"
});

function Query(queryStr) {
    this.queryStr = queryStr;
};

Query.prototype.initiateQuery = function () {
    connection.query(this.queryStr, function (err, res) {
        if (err) throw err;
        console.table(res);
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

Query.prototype.obtainInfoQuery = function (column, prompt) {
    connection.query(this.queryStr, function (err, res) {
        let list = [];
        res.forEach((item) => {
            list.push(item.column)
        });
        
        // Create a choices key with a value set to the managerList array
        prompt[prompt.length - 1].choices = list;
    })
};

Query.prototype.idLookUp = function(column, prompt) {
    connection.query(this.queryStr, function (err, res) {
        var id = res.id;
    });
}

module.exports = {
    Query
}

