DROP DATABASE IF EXISTS team;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS departments;

CREATE DATABASE team;
USE team;

CREATE TABLE departments (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  payroll INTEGER
);

CREATE TABLE roles (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary decimal,
  department_id VARCHAR,
    CONSTRAINT fk_department
        FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE SET NULL);

CREATE TABLE employees (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  roles_id VARCHAR(50),
    CONSTRAINT fk_roles 
        FOREIGN KEY (roles_id) 
        REFERENCES roles(id) 
        ON DELETE SET NULL,
  manager_id VARCHAR(30),
    CONSTRAINT fk_manager 
        FOREIGN KEY (manager_id) 
        REFERENCES employee(id) 
        ON DELETE SET NULL,
);

