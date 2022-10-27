INSERT INTO departments (name)
VALUES
  ('Admin'),
  ('Sales'),
  ('Engineering'),
  ('Finance'),
  ('Legal');
  
INSERT INTO roles (title, salary, department_id)
VALUES
  ('Service', 80000, 1),
  ('Salesperson', 100000, 3),
  ('Software Engineer', 130000, 2),
  ('Public Relations', 100000, 1),
  ('CEO', 300000, 1),
  ('Marketing', 100000, 2),
  ('CFO', 300000, 4),
  ('Accountant', 150000, 4),
  ('Lawyer', 80000, 5);

INSERT INTO employees (first_name, last_name, email, department, role_id, manager_id)
VALUES
('Luke', 'Skywalker', 'aldoran4ever@falcon.org', 'Admin', 1, 2),
('Donald', 'Duck', 'duckseason@disney.com', 'Sales', 8, 1),
('Bugs', 'Bunny', 'whatsupdoc@looney.net', 'Legal', 4, 3),
('Mike', 'Mulligan', 'maryannesbuddy@popperville.gov', 'Engineering', 5, 6),
('Peter', 'Rabbit', 'inthegardenagain@potterworld.uk', 'Legal', 6, 4),
('Julius', 'Caesar', 'gotfriendsinthesenate@rome.com', 'Finance', 3, 5);