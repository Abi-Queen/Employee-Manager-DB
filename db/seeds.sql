INSERT INTO departments (name)
VALUES
  ('Admin'),
  ('Sales'),
  ('Engineering'),
  ('Finance'),
  ('Legal');
  
INSERT INTO roles (title, salary, department)
VALUES
  ('Service', '80000', 'Admin'),
  ('Salesperson', '100000', 'Sales'),
  ('Software Engineer', '130000', 'Engineering'),
  ('Public Relations', '100000', 'Admin'),
  ('CEO', '300000', 'Admin'),
  ('Quality Control', '200000', 'Engineering'),
  ('Product Developer', '200000', 'Engineering'),
  ('Marketing', '100000', 'Sales'),
  ('CFO', '300000', 'Finance');
  ('Accountant', '150000', 'Finance');
  ('Tax Accountant', '150000', 'Finance');
  ('Lawyer', '80000', 'Legal');
  ('Analyst', '80000', 'Legal');
  
INSERT INTO employees (first_name, last_name, manager, email)
VALUES
  ('James', 'Fraser', 'Jack London', 'jf@goldenbough.edu'),
  ('Jack', 'London', 'Emil Zola', 'jlondon@ualaska.edu'),
  ('Robert', 'Bruce', 'rbruce@scotland.net'),
  ('Peter', 'Greenaway', 'pgreenaway@postmodern.com'),
  ('Derek', 'Jarman', 'Voltaire', 'djarman@prospectcottage.net'),
  ('Paolo', 'Pasolini', 'Edgar Allen Poe', 'ppasolini@salo.com'),
  ('Heathcote', 'Williams', 'Robert Louis Stevenson', 'hwilliams@bafta.com'),
  ('Sandy', 'Powell', 'spowell@oscars.com'),
  ('Emil', 'Zola', 'Nathaniel Hawthorne', 'ezola@requin.com');
  