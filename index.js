const inquirer = require('inquirer')
const cTable = require('console.table')
const db = require('./db/connection')

//create a var object to list dept names in inquirer prompt
//HELP .then notation not right choice here but how to write this?
// db.query('SELECT name FROM departments')
// .then(([rows]) => {
//     let deptNames = rows;
//     const departments = deptNames.map(({ id, name }) => ({
//         name: name,
//         value: id
//     }));

// main menu, ask user what they want to do in the app; if statements trigger individual functions
const promptUser = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'start',
            message: 'What would you like to do? (use arrow keys)',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'View all employees by department',
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
            else if (res.start === 'View all roles')
            {
                viewAllRoles()
            }
            else if (res.start === 'View all employees')
            {
                viewAllEmp()
            }
            else if (res.start === 'View all employees by department')
            {
                viewAllEmpDept()
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
    console.log('Use arrow keys to select a new prompt')
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
    console.log('Use arrow keys to select a new prompt')
    promptUser()
}

//display employees in a selected department
function viewAllEmpDept() {
    //user selects dept from list of depts, save selection as deptChoice
    inquirer.prompt([
        {
            type: 'list',
            name: 'deptChoice',
            message: 'Which department? (use arrow keys)',
            choices: departments
        }])
    //display employees where deptartment = deptChoice
    //HELP is deptChoice the right parameter for this .then? 
    .then((deptChoice) => {
        const sql = 'SELECT * FROM employees WHERE department = ?'
        const params = [res.deptChoice.id]

        db.query(sql, params, (rows) => {
            if (err) {
                console.log(err)
            }
            console.table(rows)
        })
    })
        .then(promptUser())
}

//display full roles table: ids, title, salary, department_id
const viewAllRoles = () => {
    db.query('SELECT * FROM roles', (err, res) => {
        if (err) {
            console.log(err)
        }
        console.log(' \n\ ')
        console.table(res)
    })
    console.log('Use arrow keys to select a new prompt')
    promptUser()
}

//ask user for new dept name; add to db
const addDept = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'newDeptName',
            message: 'What is the name of the new department?',
            validate: newDeptNameInput => {
                if (newDeptNameInput) {
                    return true;
                } else {
                    console.log('A name is needed.');
                    return false;
                }
            } 
        }
    ])
    //insert into departments table
    .then((res) => {
        const sql = 'INSERT INTO departments (name) VALUES (?)'
        const params = [res.newDeptName.id]
        db.query(sql, params, (err, res) => {
            if(err) {
                console.log(err)
            }
            console.table(res)
        })
        console.log('New department added.')
    })
    promptUser()
}

//ask user for new role values (title, salary, dept id); add to db
const addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'newRoleTitle',
            message: 'What is the title of the new role?',
            validate: newRoleTitleInput => {
                if (newRoleTitleInput) {
                    return true;
                } else {
                    console.log('A title is needed.');
                    return false;
                }
            } 
        },
        {
            type: 'input',
            name: 'newRoleSalary',
            message: 'What is the salary of the new role?',
            validate: newRoleSalaryInput => {
                if (newRoleSalaryInput) {
                    return true;
                } else {
                    console.log('A salary is needed.');
                    return false;
                }
            }
        },
        {
            type: 'choice',
            name: 'newRoleDept',
            message: 'To which department does the new role belong? (Use arrow keys)'
        }
    ])
    //insert into roles table
    //HELP how to get department id rather than name???
    .then((res) => {
        const sql = 'INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)'
        const params = [res.newRolesTitle.id, res.newRolesSalary.id, res.newRoleDept.id]
        db.query(sql, params, (err, res) => {
            if(err) {
                console.log(err)
            }
            console.table(res)
        })
        console.log('New role added.')
    })
    promptUser()
}

promptUser()
