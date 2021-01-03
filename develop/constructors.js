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

