const inquirer = require('inquirer')
require("console.table");
// const mysql = require('mysql')
// const fs = require('fs')
const db = require('./db/connection');
const { title } = require('process');

// when input salary, do parseInt to convert before adding to db; do for all inquirer if they need int, bc they're strings

// main menu, ask user what they want to do in the app; if statements trigger individual functions
const promptUser = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'start',
            message: 'What would you like to do? (use arrow keys)',
            choices: [
                'View all departments',
                'View all employees by department',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Quit'
            ]
        }.then(function(res){
            if(res.start === 'View all departments')
            {
                viewAllDept()
            }
            else if (res.start === 'View all employees by department')
            {
                viewAllEmpDept()
            }
            else if (res.start === 'View all roles')
            {
                viewAllRoles()
            }
            else if (res.start === 'Add a department')
            {
                addDept()
            }
            else if (res.start === 'Add a role')
            {
                addRole()
            }
            else if (res.start === 'Add an employee')
            {
                addEmp()
            }
            else if (res.start === 'Update an employee role')
            {
                updateEmpRole()
            }
            else if (res.start === 'Quit')
            {
                quit()
            }
        })
    ])
};

//display full employees table: ids, first name, last name, job title, department, salary, manager
function viewAllDept() {
    db.query('SELECT * FROM departments', (err, rows) => {
        if (err) {
            console.log(err)
        }
        console.table(rows);
    })
    promptUser()
};

//display employees in a selected department
function viewAllEmpDept() {
    //create a var object to list dept names in inquirer prompt
    db.query('SELECT name FROM departments')
    .then(([rows]) => {
        let deptNames = rows;
        const departments = deptNames.map(({ id, name }) => ({
            name: name,
            value: id
        }));
        //user selects dept from list of depts, save selection as deptChoice
        inquirer.prompt([
        {
            type: 'list',
            name: 'deptChoice',
            message: 'Which department? (use arrow keys)',
            choices: departments
        }])
    })
    //display employees where deptartment = deptChoice
    //HELP is deptChoice the right parameter for this .then? 
    .then((deptChoice) => {
        const sql = 'SELECT * FROM employees WHERE department = ?'
        const params = [res.deptChoice.id]

        db.query(sql, params, (rows) => {
            if (err) {
                console.log(err);
            }
            console.table(rows);
        })
    })
        .then(promptUser())
}; 

//display full roles table: id, job title, dept, salary
function viewAllRoles() {
    db.query(`SELECT * FROM roles`, (err, rows) => {
        if (err) {
            console.log(err);
        }
        console.table(rows);
    })
    promptUser()
};

//ask user for new dept name, manager; add res to dept table
function addDept() {
    //ask user to enter name for new dept, save as var newDept
    inquirer.prompt([
        {
            type: 'input',
            name: 'newDept',
            message: 'What is the name of the new department?',
            validate: newDeptInput => {
                if (newDeptInput) {
                    return true;
                } else {
                    console.log('A name is needed.');
                    return false;
                }
            }
        }
    ])
    //ask user to enter manager for new dept
    //HELP can the next prompt run here or does it need .then?
    inquirer.prompt([
        {
            type: 'input',
            name: 'newDeptMgr',
            message: 'Enter first name and last name of the new department manager.',
            validate: newDeptMgrInput => {
                if (newDeptMgrInput) {
                    return true;
                } else {
                    console.log('A name is needed.');
                    return false;
                }
            }
        }
    ])
    //insert res for newDept and newDeptMgr into dept table
    //HELP correct way to explain this: values or vars?
    .then(() => {
        const sql = 'INSERT INTO departments (name, manager) VALUES ?,?'
        const params = [res.newDept.id, res.newDeptMgr.id]

        //HELP what are params now? what to console log? Maybe don't need this part at all? just go straight to 167 console log?
        db.query(sql, params, (err, rows) => {
            if (err) {
                console.log(err);
            }
            console.table(rows);
        })
    })
    .then(console.log('Department added.'))
    .then(promptUser())
};

//ask user for new role job title, salary, dept; add res to roles table
function addRole() {
    //ask user to enter name for new role
    inquirer.prompt([
        {
            type: 'input',
            name: 'newRoleTitle',
            message: 'What is the job title?',
            validate: newRoleTitleInput => {
                if (newRoleTitleInput) {
                    return true;
                } else {
                    console.log('A job title is needed.');
                    return false;
                }
            }
        }
    ])
    //create var departments to list department names in inquirer list so user can choose one 
    //HELP do I need .then here? should this part be a nested function? and do I need to create a new const departments, bc same as viewEmpDept above? or do I need a new one here bc resulting var (deptChoice) will be diff? const or var or let for function scoped?
    .then(db.query('SELECT name FROM departments'))
    //HELP need .then here or not?
    .then(([rows]) => {
        let deptNames = rows;
        const departments = deptNames.map(({ id, name }) => ({
            name: name,
            value: id
        }))
        //user selects dept from list, save choice as newRoleDeptChoice
        //HELP need .then here or not?
        .then(inquirer.prompt([
            {
                type: 'list',
                name: 'newRoleDeptChoice',
                message: 'To which department does the new role belong? (use arrow keys)',
                choices: departments
            }
        ])
        )
    })
    //ask user for new role salary, save car newRoleSalary
    .then(inquirer.prompt([
        {
            type: 'input',
            name: 'newRoleSalary',
            message: 'What is the salary for the new role?',
            validate: newRoleSalaryInput => {
                if (newRoleSalaryInput) {
                    return true;
                } else {
                    console.log('Please enter a salary.');
                    return false;
                }
            }
        }
    ])
    )
    //update roles table with newRoleTitle, deptChoice, newRoleSalary (parseInt to convert from string) values
    //HELP need params/argument for this .then?
    .then((newRoleTitle, newRoleDeptChoice, newRoleSalary) => {
        const sql = 'INSERT INTO roles (title, department, salary) VALUES ?,?,?'
        const params = [res.newRoleTitle.id, res.newRoleDeptChoice.id, parseInt(res.newRoleSalary.id)]

        //HELP what are params now? console log? mabye don't need this part at all, go straight to console log 'role added'?
        db.query(sql, params, (err, rows) => {
            if (err) {
                console.log(err);
            }
            console.table(rows);
        })
    })
    .then(console.log('Role added.'))
    .then(promptUser())
}; 

//add new employee to employee table with first name, last name, email, role, manager 
function addEmp() {
    //ask user for new employee first name, save as var newEmpFN
    inquirer.prompt([
        {
            type: 'input',
            name: 'newEmpFN',
            message: 'What is the first name of the new employee?',
            validate: newEmpFNInput => {
                if (newEmpFNInput) {
                    return true;
                } else {
                    console.log('A name is needed.');
                    return false;
                }
            }
        }
    ])
    //HELP can the next prompt run here or does it need .then?
    //ask user for new employee last name, save as var 
    inquirer.prompt([
        {
            type: 'input',
            name: 'newEmpLN',
            message: 'What is the last name of the new employee?',
            validate: newEmpLNInput => {
                if (newEmpLNInput) {
                    return true;
                } else {
                    console.log('A name is needed.');
                    return false;
                }
            }
        }
    ])
    //ask user for new employee email, save as var 
    inquirer.prompt([
        {
            type: 'input',
            name: 'newEmpEmail',
            message: 'What is the email address of the new employee?'
        }
    ])
    //create var for listing department names from dept table in inquirer prompt
    //HELP do I need to do this again, or should this be a global function each prompt can use like this: (see below)
    .then((listDepts)
    //user selects dept from list, save choice as newEmpdeptChoice
    //HELP need .then here or not?
    .then(inquirer.prompt([
        {
            type: 'list',
            name: 'newEmpDeptChoice',
            message: 'To which department does the new role belong? (use arrow keys)',
            choices: departments
        }
    ])
    )
    )
    //ask user to choose new employee role, save as var 
    //HELP need .then here or not?
    //create list of role titles from roles table for inquirer prompt list
    .then(db.query('SELECT title FROM roles'))
    //HELP need .then here before (([rows]))?
        (([rows]) => {
            let rolesTitles = rows;
            const roles = rolesTitles.map(({ id, title }) => ({
                name: title,
                value: id
            }))
            //user selects role from list, save selection as newEmproleChoice
            .then(inquirer.prompt([
                {
                    type: 'list',
                    name: 'newEmpRoleChoice',
                    message: 'What is the role of the new employee? (use arrow keys)',
                    choices: roles
                }
            ])
        )})
    //ask user for new employee manager, save as var 
    inquirer.prompt([
        {
            type: 'input',
            name: 'newEmpMgr',
            message: 'Who is the manager of the new employee?',
            validate: newEmpMgrInput => {
                if (newEmpMgrInput) {
                    return true;
                } else {
                    console.log('A name is needed.');
                    return false;
                }
            }
        }
    ])
    //save new employee in db by updating employees table with vars newEmpFN, newEmpFN, newEmpEmail, newEmpDeptChoice, newEmpRoleChoice, newEmpMgr
    .then(() => {
        const sql = 'INSERT INTO employees (first_name, last_name, email, department, role, manager) VALUES ?,?,?,?,?,?'
        const params = [newEmpFN, newEmpLN, newEmpEmail, newEmpDept, newEmpRole, newEmpMgr]

        //HELP what are params now? console log?
        db.query(sql, params (err, newDept, newDeptMgr) => {
            if (err) {
                console.log(err);
            }
            console.log('What to do here?');
        })
    })
    .then(console.log('Employee added.'))
    .then(promptUser())

};

function updateEmpRole() {
    //ask user to select an employee
    //generate list of employees for inquirer prompt from employee table, save as employees
    //HELP is this SELECT query correct?
    (db.query('SELECT first_name, last_name FROM employees'))
    //HELP need .then here before (([rows]))?
    //HELP how to write this: name, id?
        (([rows]) => {
            let empNames = rows;
            const employees = empNames.map(({ id, first_name, last_name }) => ({
                name: ?
                value: id
            }))
            //user selects role from list, save selection as updateEmpChoice
            .then(inquirer.prompt([
                {
                    type: 'list',
                    name: 'updateEmpChoice',
                    message: 'Which employee do you wish to update? (use arrow keys)',
                    choices: employees
                }
            ])
        )})
    //ask user to select a new role
    //generate list of roles for inquirer prompt from roles table, save as updateRole
    //HELP is this SELECT query correct?
    (db.query('SELECT title FROM roles'))
    //HELP need .then here before (([rows]))?
        (([rows]) => {
            let jobTitles = rows;
            const roles = jobTitles.map(({ id, name }) => ({
                name: title,
                value: id
            }))
            //user selects role from list, save selection as updateEmpChoice
            .then(inquirer.prompt([
                {
                    type: 'list',
                    name: 'updateRoleChoice',
                    message: 'What is the new role of the employee? (use arrow keys)',
                    choices: roles
                }
            ]))
        })
    .then(() => {
        const sql = 'UPDATE employees SET role_title = ? WHERE id = ?'
        const params = [res.updateEmpRole, res.updateEmpChoice]
        db.query(sql, params, (err, updateEmpRole, updateEmpChoice) => {
            if (err) {
                console.log(err)
            }
            console.log(updateEmpChoice, updateEmpRole)
        })
    })
    .then(console.log('Employee role updated.'))
    .then(db.query('SELECT * FROM employees', (err, rows) => {
        if (err) {
            console.log(err)
        }
        console.log(rows)
    }))
    .then(promptUser());
};

