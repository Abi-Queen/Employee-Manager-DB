const inquirer = require('inquirer')
const cTable = require('console.table')
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
        }
    ]).then((res) => {
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
            else if (res.start === 'View all employees')
            {
                viewAllEmp()
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
}

//display full departments table: ids, names
const viewAllDept = () => {
    db.query('SELECT * FROM departments', (err, res) => {
        if (err) {
            console.log(err)
        }
        console.log(' \n\ ')
        console.table(res)
    })
    promptUser()
}

//display full employees table: ids, first_name, last_name, email, role_id, manager_id
const viewAllEmp = () => {
    db.query('SELECT * FROM employees', (err, res) => {
        if (err) {
            console.log(err)
        }
        console.log(' \n\ ')
        console.table(res)
    })
    promptUser()
}

//display employees in a selected department
const viewAllEmpDept = () => {
    db.query('SELECT * FROM departments')
    .then(([rows]) => {
        let departments = rows;
        const departmentChoices = departments.map(({ id, name }) => ({
            name: name,
            value: id
        }))
    inquirer.prompt([
            {
                type: 'list',
                name: 'deptChoice',
                message: 'Which department? (use arrow keys)',
                choices: departmentChoices
            }
        ])
        .then((res) => {
            const sql = 'SELECT first_name, last_name FROM employees WHERE department = (?)'
            const params = [res.deptChoice.id]

            db.query(sql, params, (res) => {
                if(err) {
                    console.log(err);
                }
                console.log(' \n\ ')
                console.table(res);
            })
        })
    })
    promptUser()
}

//display full roles table: ids, title, salary, department_id
const viewAllRoles = () => {
    db.query(`SELECT * FROM roles`, (err, rows) => {
        if (err) {
            console.log(err)
        }
        console.table([rows])
    })
    promptUser()
}

//ask user for new dept name; add to db
const addDept = () => {
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
    //insert newDept into departments table
    //HELP: how to input into console.table
    ]).then((res) => {
        console.log(res)
        const sql = 'INSERT INTO departments (name) VALUES (?)'
        const params = [res.newDept.id]
        db.query(sql, params, (err, rows) => {
            if(err) {
                console.log(err)
            }
            cTable([res])
        })
    })
}

//call main menu function
promptUser()
