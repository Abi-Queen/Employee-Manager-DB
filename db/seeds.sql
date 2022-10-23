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

INSERT INTO employees (first_name, last_name, email, role_id)
VALUES
('Luke', 'Skywalker', 'aldoran4ever@falcon.org', 1),
('Donald', 'Duck', 'duckseason@disney.com', 8),
('Bugs', 'Bunny', 'whatsupdoc@looney.net', 4),
('Mike', 'Mulligan', 'maryannesbuddy@popperville.gov', 5),
('Peter', 'Rabbit', 'inthegardenagain@potterworld.uk', 6),
('Julius', 'Caesar', 'gotfriendsinthesenate@rome.com', 3);

-- INSERT INTO employees (first_name, last_name, email, role_id, manager_id)
-- VALUES
-- ('Luke', 'Skywalker', 'aldoran4ever@falcon.org', 1, 2),
-- ('Lightning', 'McQueen', 'thunderhollow@cars.net', 2, 4),
-- ('Donald', 'Duck', 'duckseason@disney.com', 8, 7),
-- ('Bugs', 'Bunny', 'whatsupdoc@looney.net', 4, 6),
-- ('Mike', 'Mulligan', 'maryannesbuddy@popperville.gov', 5, 4),
-- ('Peter', 'Rabbit', 'inthegardenagain@potterworld.uk', 6, 3),
-- ('Octavian Caesar', 'Augustus', 'justfirstcitizen@rome.com', 7, 3),
-- ('Julius', 'Caesar', 'gotfriendsinthesenate@rome.com', 3, 5);