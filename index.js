const inquirer = require('inquirer')
const mysql = require('mysql')
const fs = require('fs')
const db = require('./db/connection')

// capture user input answering inquirer prompts
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

function viewAllDept() {
    db.query('SELECT * FROM departments', (err, rows) => {
        if (err) {
            console.log(err)
        }
        console.log(rows)
    })
    promptUser()
};

function viewAllEmpDept() {
    //create a var: list of dept names
    db.qyery('SELECT name FROM departments')
    .then(([rows]) => {
        let deptNames = rows;
        const departments = deptNames.map(({ id, name }) => ({
            name: name,
            value: id
        }));
        //user selects dept from list, save choice as deptChoice
        inquirer.prompt([
        {
            type: 'list',
            name: 'deptChoice',
            message: 'Which department? (use arrow keys)',
            choices: departments
        }])
        //display employees where deptartment = deptChoice
        .then(() => {
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
    })
}; 

function viewAllRoles() {
    db.query(`SELECT * FROM roles`, (err, rows) => {
        if (err) {
            console.log(err);
        }
        console.log(rows);
    })
    promptUser()
};

function addDept() {
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
    // can the next prompt run here or does it need .then?
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
    .then()
    //ask user name of new dept, save as var newDept
    //ask user manager of new dept, save as var newDeptMgr
    //save name of dept in db by updating dept table with newDept and newDeptMgr
    //console.log dept added
}


