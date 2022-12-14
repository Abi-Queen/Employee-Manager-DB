const inquirer = require('inquirer')
// const cTable = require('console.table')
const db = require('./db/connection')
// const { resolve } = require('path')
const { setTimeout } = require('timers/promises')

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
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Remove a department',
                'Remove an employee',
                // 'View all employees in a department',
                'Quit'
            ]
        }
    ]).then((res) => {
        switch(res.start){
            case 'View all departments':
                viewAllDept()
                break
            case 'View all roles':
                viewAllRoles()
                break
            case 'View all employees':
                viewAllEmp()
                break
            case 'Add a department':
                addDept()
                break
            case 'Add a role':
                addRole()
                break
            case 'Add an employee':
                addEmp()
                break
            case 'Update an employee role':
                updateEmpRole()
                break
            case 'Remove a department':
                removeDept()
                break
            case 'Remove an employee':
                removeEmp()
                break
            case 'View all employees in a department':
                viewAllEmpDept()
                break
            case 'Quit':
                quit() 
                break
            default:
                console.log("Please select a choice.")
        }
    })
}


//VIEW ALL DEPARTMENTS: display full departments table: ids, names
const viewAllDept = () => {
    db.query('SELECT * FROM departments', (err, res) => {
        if (err) {
            console.log(err)
        }
        console.log(' \n\ ')
        console.log('=====================================')
        console.table(res)
        console.log('=====================================')
        console.log(' \n\ ')
    })
    setTimeout(promptUser(), 2000)
}

//VIEW ALL EMPLOYEES: display full employees table: ids, first_name, last_name, email, role_id, manager_id
const viewAllEmp = () => {
    db.query('SELECT * FROM employees', (err, res) => {
        if (err) {
            console.log(err)
        }
        console.log(' \n\ ')
        console.log('=====================================')
        console.table(res)
        console.log('=====================================')
        console.log(' \n\ ')
    })
    setTimeout(promptUser(), 2000)
}

//VIEW ALL ROLES: display full roles table: ids, title, salary, department_id
const viewAllRoles = () => {
    db.query('SELECT * FROM roles', (err, res) => {
        if (err) {
            console.log(err)
        }
        console.log(' \n\ ')
        console.log('=====================================')
        console.table(res)
        console.log('=====================================')
        console.log(' \n\ ')
    })
    setTimeout(promptUser(), 2000)
}

//ADD DEPARTMENT: ask user for new dept name; add to db
const addDept = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'newDeptName',
            message: 'What is the name of the new department?',
            validate: newDeptNameInput => {
                if (newDeptNameInput) {
                    return true
                } else {
                    console.log('A name is needed.')
                    return false
                }
            }
        }
    ])
        //insert into departments table
        .then((res) => {
            const sql = 'INSERT INTO departments (name) VALUES (?)'
            const params = [res.newDeptName]
            console.log('params = ' + JSON.stringify(params))

            db.query(sql, params, (err, res) => {
                if (err) {
                    console.log(err)
                }
                console.log(' \n\ ')
                console.log('=====================================')
                console.log('New department added.')
                console.log('=====================================')
                console.log(' \n\ ')
            })
            setTimeout(promptUser(), 2000)
        })
}

//ADD ROLE: ask user for new role values (title, salary, dept id); add to db
const addRole = () => {
    db.promise().query('SELECT * FROM departments')
    .then(([rows]) => {
        let deptNames = rows;
        departments = deptNames.map(({ id, name }) => ({
            name: `${name}`,
            value: id
        }))
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
            type: 'list',
            name: 'newRoleDept',
            message: 'To which department does the new role belong? (Use arrow keys)',
            choices: departments
        }
    ])
        //insert into roles table
        .then((res) => {
            const sql = 'INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)'
            const params = [res.newRoleTitle, res.newRoleSalary, res.newRoleDept]
            db.query(sql, params, (err, res) => {
                if (err) {
                    console.log(err)
                }
                console.log(' \n\ ')
                console.log('=====================================')
                console.log('New role added.')
                console.log('=====================================')
                console.log(' \n\ ')
            })
            setTimeout(promptUser(), 2000)
        })
    })
}

// ADD EMPLOYEE
const addEmp = () => {
    let roleTitles
    let deptNames
    let mgrNames
    db.promise().query('SELECT * FROM roles')
        .then(([roles]) => {
            roleTitles = roles.map(({ id, title }) => ({
                name: title,
                value: id
            }))
            db.promise().query('SELECT * FROM departments')
                .then(([rows]) => {
                deptNames = rows.map(({ name }) => name)
                db.promise().query('SELECT * FROM employees')
                .then(([rows]) => {
                    let employeeRows = rows
                    mgrNames = employeeRows.map(({ manager_id, first_name, last_name }) => ({
                        name: `${first_name} ${last_name}`,
                        value: manager_id
                    }))
                        inquirer.prompt([
                        {
                            type: 'input',
                            name: 'newEmpFN',
                            message: 'Enter new employee first name.',
                            validate: newEmpFNInput => {
                                if (newEmpFNInput) {
                                    return true;
                                } else {
                                    console.log('A name is needed.');
                                    return false;
                                }
                            }
                        },
                        {
                            type: 'input',
                            name: 'newEmpLN',
                            message: 'Enter new employee last name',
                            validate: newEmpLNInput => {
                                if (newEmpLNInput) {
                                    return true;
                                } else {
                                    console.log('A name is needed.');
                                    return false;
                                }
                            }
                        },
                        {
                            type: 'input',
                            name: 'newEmpEmail',
                            message: 'What is the email for the new employee?',
                            validate: newEmpEmailInput => {
                                if (newEmpEmailInput) {
                                    return true;
                                } else {
                                    console.log('An email is needed.');
                                    return false;
                                }
                            }
                        },
                        {
                            type: 'list',
                            name: 'newEmpRole',
                            message: 'What is the role of the new employee? (Use arrow keys)',
                            choices: roleTitles
                        },
                        {
                            type: 'list',
                            name: 'newEmpDept',
                            message: 'To which department does the new employee belong? (Use arrow keys)',
                            choices: deptNames
                        },
                        {
                            type: 'list',
                            name: 'newEmpManager',
                            message: 'Who is the manager of the new employee? (Use arrow keys)',
                            choices: mgrNames
                        }
                    ])
                        //insert into employees table
                        .then((res) => {
                            const sql = 'INSERT INTO employees (first_name, last_name, email, department, role_id, manager_id) VALUES (?,?,?,?,?,?)'
                            const params = [res.newEmpFN, res.newEmpLN, res.newEmpEmail, res.newEmpDept, res.newEmpRole, res.newEmpManager]
                            db.query(sql, params, (err, res) => {
                                if (err) {
                                    console.log(err)
                                }
                                console.log(' \n\ ')
                                console.log('=====================================')
                                console.log('Employee added.')
                                console.log('=====================================')
                                console.log(' \n\ ')
                            })
                            setTimeout(promptUser(), 2000) 
                            })
                        })
                })
        })
    }

// UPDATE EMPLOYEE ROLE
const updateEmpRole = () => {
    //generate list of employees for inquirer prompt from employee table, save as updateEmpChoices
    let updateEmpChoices 
    let updateEmpNewRole
    db.promise().query('SELECT * FROM employees')
        .then(([rows]) => {
            let employeeRows = rows
            updateEmpChoices = employeeRows.map(({ employee_id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: employee_id
            }))
            //generate list of roles for inquirer prompt from roles table, save as updateEmpNewRole
            db.promise().query('SELECT * FROM roles')
                .then(([roles]) => {
                updateEmpNewRole = roles.map(({ id, title }) => ({
                    name: title,
                    value: id
                }))
    //ask user to select an employee
    inquirer.prompt([
        {
            type: 'list',
            name: 'updateEmpChoice',
            message: 'Which employee do you wish to update? (use arrow keys)',
            choices: updateEmpChoices
        },
        //ask user to select new role
        {
            type: 'list',
            name: 'updateRoleChoice',
            message: 'What will the new role be? (use arrow keys)',
            choices: updateEmpNewRole
        }
    ])
        .then((res) => {
            const sql = 'UPDATE employees SET employees.role_id = ? WHERE employee_id = ?'
            const params = [res.updateRoleChoice, res.updateEmpChoice]
            db.query(sql, params, (err, res) => {
                if (err) {
                    console.log(err)
                }
                console.log(' \n\ ')
                console.log('=====================================')
                console.log('Employee role updated.')
                console.log('=====================================')
                console.log(' \n\ ')
            })
            setTimeout(promptUser(), 2000)
            })
        })
    })
}

// *BONUS* REMOVE DEPARTMENT
const removeDept = () => {
    let deptChoices 
    db.promise().query('SELECT * FROM departments')
    .then(([rows]) => {
    deptChoices = rows.map(({ name }) => name)
    inquirer.prompt([
        {
            type: 'list',
            name: 'removeDept',
            message: 'Which department do you wish to remove? (use arrow keys)',
            choices: deptChoices
        }
    ])
        .then((res) => {
            const sql = 'DELETE FROM departments WHERE name = (?)'
            const params = [res.removeDept]

            db.query(sql, params, (err, res) => {
                if (err) {
                    console.log(err)
                }
                console.table(res)
                console.log(' \n\ ')
                console.log('=====================================')
                console.log('Department removed.')
                console.log('=====================================')
                console.log(' \n\ ')
                })
            setTimeout(promptUser(), 2000)
            })
        })
   }


// *BONUS* REMOVE EMPLOYEE
const removeEmp = () => {
    let empNames 
    db.promise().query('SELECT * FROM employees')
    .then(([rows]) => {
        let employeeRows = rows
        empNames = employeeRows.map(({ employee_id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: employee_id
        }))
    inquirer.prompt([
        {
            type: 'list',
            name: 'removeEmp',
            message: 'Which employee do you wish to remove? (use arrow keys)',
            choices: empNames
        }
    ])
        .then((res) => {
            const sql = 'DELETE FROM employees WHERE employee_id = (?)'
            const params = [res.removeEmp]

            db.query(sql, params, (err, res) => {
                if (err) {
                    console.log(err)
                }
                console.table(res)
                console.log(' \n\ ')
                console.log('=====================================')
                console.log('Employee removed.')
                console.log('=====================================')
                console.log(' \n\ ')
            })
            setTimeout(promptUser(), 2000)
            })
        })
    }

//*BONUS* VIEW ALL EMPLOYEES BY DEPARTMENT: display employees in a selected department
function viewAllEmpDept() {
    //user selects dept from list of depts, save selection as deptChoice
    let byDeptChoice
    db.promise().query('SELECT * FROM departments')
        .then(([rows]) => {
        byDeptChoice = rows.map(({ name }) => name)
    inquirer.prompt([
        {
            type: 'list',
            name: 'deptChoice',
            message: 'Which department? (use arrow keys)',
            choices: byDeptChoice
        }])
        //display employees where deptartment = byDeptChoice
        .then(res => {
            const sql = 'SELECT * FROM employees WHERE department = ?'
            const params = [res.deptChoice]
            db.promise().query(sql, params, (err, res) => {
                if (err) {
                    console.log(err)
                }
                console.log(' \n\ ')
                console.log('=====================================')
                console.table(res)
                console.log('=====================================')
                console.log(' \n\ ')
            })
            setTimeout(promptUser(), 2000)
        })
    })
}

// quit by returning to main prompt 
const quit = () => {
    console.log('Goodbye.')
}

promptUser()