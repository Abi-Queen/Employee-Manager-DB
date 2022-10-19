CREATE TABLE departments (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  manager VARCHAR(30)
);

CREATE TABLE roles (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    department_name VARCHAR(30),
    salary INTEGER NOT NULL,
    CONSTRAINT fk_department FOREIGN KEY (department_name) REFERENCES departments(name) ON DELETE SET NULL
);

CREATE TABLE employees (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(50),
    job_title VARCHAR(30) NOT NULL,
    department VARCHAR(30),
    salary VARCHAR(30),
    manager VARCHAR(30),
    CONSTRAINT fk_job_title FOREIGN KEY (job_title) REFERENCES roles(title) ON DELETE SET NULL,
    CONSTRAINT fk_department FOREIGN KEY (department) REFERENCES departments(name) ON DELETE SET NULL,
    CONSTRAINT fk_salary FOREIGN KEY (salary) REFERENCES roles(salary) ON DELETE SET NULL,
    CONSTRAINT fk_manager FOREIGN KEY (manager) REFERENCES departments(manager) ON DELETE SET NULL
);

