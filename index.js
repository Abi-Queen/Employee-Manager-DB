const inquirer = require('inquirer')
const mysql = require('mysql')
const fs = require('fs')
const db = require('./db/connection')

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
        console.log(rows)
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
    //HELP is deptChoice the right parameter for this .then? or no param? is it a param or argument?
    .then((deptChoice) => {
        const sql = 'SELECT * FROM employees WHERE department = ?'
        const params = [deptChoice]

        db.query(sql, params, (err, employees) => {
            if (err) {
                console.log(err);
            }
            console.log(employees);
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
        console.log(rows);
    })
    promptUser()
};

//ask user for new dept name, manager; save input as var object and add to dept table
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
    //ask user to enter manager for new dept, save as var newDeptMgr
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
    //save name of dept and deptmgr in db by inserting values into dept table
    //HELP correct way to explain this: values or vars?
    .then(() => {
        const sql = 'INSERT INTO departments (name, manager) VALUES ?,?'
        const params = [newDept, newDeptMgr]

        //HELP what are params now? what to console log? Maybe don't need this part at all? just go straight to 167 console log?
        db.query(sql, params, (err, newDept, newDeptMgr) => {
            if (err) {
                console.log(err);
            }
            console.log(newDept, newDeptMgr);
        })
    })
    .then(console.log('Department added.'))
    .then(promptUser())
};

//ask user for new role job title, salary, dept; save input as var object and add to roles table
function addRole() {
        //ask user to enter name for new role, save as var newRoleTitle
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
    })
    //user selects dept from list, save choice as deptChoice or does it need a diff name bc did this above for adding a dept?
    //HELP need .then here or not?
    .then(inquirer.prompt([
        {
            type: 'list',
            name: 'deptChoice',
            message: 'To which department does the new role belong? (use arrow keys)',
            choices: departments
        }
    ])
    )
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
    //update roles table with newRoleTitle, deptChoice, newRoleSalary values
    //HELP need params/argument for this .then?
    .then((newRoleTitle, deptChoice, newRoleSalary) => {
        const sql = 'INSERT INTO roles (title, department, salary) VALUES ?,?,?'
        const params = [newRoleTitle, deptChoice, newRoleSalary]

        //HELP what are params now? console log? mabye don't need this part at all, go straight to console log 'role added'?
        db.query(sql, params, (err, newRoleTitle, deptChoice, newRoleSalary) => {
            if (err) {
                console.log(err);
            }
            console.log(newRoleTitle, deptChoice, newRoleSalary);
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
    //save name of dept and deptmgr in db by updating table with newDept and newDeptMgr vars
    .then(() => {
        const sql = 'INSERT INTO departments (name, manager) VALUES ?,?'
        const params = [newDept, newDeptMgr]

        //HELP what are params now? console log?
        db.query(sql, params (err, newDept, newDeptMgr) => {
            if (err) {
                console.log(err);
            }
            console.log(newDept, newDeptMgr);
        })
    })
    .then(console.log('Department added.'))
    .then(promptUser())
};


