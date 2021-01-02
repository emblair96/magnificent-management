let queryEmployees = "SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.department_name FROM employees e INNER JOIN roles r ON e.role_id = r.id INNER JOIN departments d ON r.department_id = d.id ORDER BY id";

let queryByDept = "SELECT e.id, e.first_name, e.last_name, d.department_name FROM employees e INNER JOIN roles r ON e.role_id = r.id INNER JOIN departments d ON r.department_id = d.id WHERE department_name = ? ORDER BY id";

let queryManagers = "SELECT a.first_name FROM employees a INNER JOIN employees b ON a.id = b.manager_id";

let queryByManager = "SELECT a.first_name AS manager, b.first_name, b.last_name FROM employees a INNER JOIN employees b ON a.id = b.manager_id WHERE a.first_name = ?"; 



module.exports = {
    queryEmployees,
    queryByDept,
    queryManagers,
    queryByManager
};