DROP DATABASE IF EXISTS "employee_mngmt_db";
CREATE DATABASE "employee_mngmt_db";
USE "employee_mngmt_db";

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT, 
    department_name VARCHAR(30),
    PRIMARY KEY (id)
);

INSERT INTO departments (department_name) values ("Sales"), ('Engineering'), ("Finance"), ("Legal"), ("Management");

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT, 
    title VARCHAR(30),
    salary DECIMAL(10, 2),
    department_id INT NOT NULL,
    PRIMARY KEY (id),
    KEY fk_department_id (department_id),
    CONSTRAINT fk_department_id FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO roles (title, salary, department_id) values ("Software Engineer", "80000", 2)

INSERT INTO roles (title, salary, department_id) values ("Lead Engineer", "120000", 2)

INSERT INTO roles (title, salary, department_id) values ("Lawyer", "120000", 4)


CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT, 
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    manager_id INT NOT NULL,
    PRIMARY KEY (id),
    KEY fk_role_id (role_id),
    CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    KEY fk_department_id (manager_id),
    CONSTRAINT fk_manager_id FOREIGN KEY (manager_id) REFERENCES roles(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO employees (first_name, last_name, role_id, manager_id) values ("Emily", "Blair", 1, 3);