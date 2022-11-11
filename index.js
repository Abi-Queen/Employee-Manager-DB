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
                'View all employees by department',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Remove a department',
                'Quit'
            ]
        }
    ]).then((res) => {
        // switch(res.start){
        //     case 'View all departments':
        //         viewAllDept()
        //         break;
        //     case 'View all roles':
        //         viewAllRoles()
        //         break
        //     default:
        //         console.log("didnt meet and of the previous conditions")
        // }
        if (res.start === 'View all departments') {
            viewAllDept()
        }
        else if (res.start === 'View all roles') {
            viewAllRoles()
        }
        else if (res.start === 'View all employees') {
            viewAllEmp()
        }
        else if (res.start === 'View all employees by department') {
            viewAllEmpDept()
        }
        else if (res.start === 'Add a department') {
            addDept()
        }
        else if (res.start === 'Add a role') {
            addRole()
        }
        else if (res.start === 'Add an employee') {
            addEmp()
        }
        else if (res.start === 'Update an employee role') {
            updateEmpRole()
        }
        else if (res.start === 'Remove a department') {
            removeDept()
        }
        else if (res.start === 'Quit') {
            quit()
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
        console.table(res)
    })
    promptUser()
}

//VIEW ALL EMPLOYEES: display full employees table: ids, first_name, last_name, email, role_id, manager_id
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

//VIEW ALL EMPLOYEES BY DEPARTMENT: display employees in a selected department
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
        .then(res => {
            // employees.filter(emp => emp.departments === res)
            // console.log('emp = ' + emp)

            const sql = 'SELECT * FROM employees WHERE employees.department = (?)'
            console.log(employees)
            const params = [employees.filter(emp => emp.department === res.deptChoice)]
            console.log(employees[0].department)
            console.log("string-id " + res.deptChoice)
            console.log("res = " + JSON.stringify(res))
            console.log("params = " + params)
            //remove the .then that this promise is inside of?
            db.promise().query(sql, params, (rows) => {
                if (err) {
                    console.log(err)
                }
                console.log("testing")
                console.log(rows)
                console.table(rows)
            })
        })
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
        setTimeout(promptUser(), 2000)
    })
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
                console.log('New department added.')
                setTimeout(promptUser(), 2000)
            })
        })
}

//ADD ROLE: ask user for new role values (title, salary, dept id); add to db
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
                console.table(res)
            })
            console.log('Role added.')
            console.table(roles)
            promptUser()
        })
}

//ADD EMPLOYEE: user inputs new employee values (first_name, last_name, email, role_id); add to db
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
                    mgrNames = employeeRows.map(({ id, first_name, last_name }) => ({
                        name: `${first_name} ${last_name}`,
                        value: id
                    }))
                    console.log(JSON.stringify(mgrNames))
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
                                // console.table(res)
                                console.log('New employee added.')
                                setTimeout(promptUser(), 2000)
                            })
                        })
                })
        })
    })
}

const updateEmpRole = () => {
    let roleTitles
    let empName
    db.promise().query('SELECT * FROM employees')
        .then(([rows]) => {
            let employeeRows = rows
            empName = employeeRows.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }))
            console.log(JSON.stringify(empName))
    db.promise().query('SELECT * FROM roles')
        .then(([roles]) => {
            roleTitles = roles.map(({ id, title }) => ({
                name: title,
                value: id
            }))
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'updateEmpChoice',
                            message: 'Which employee do you wish to update? (Use arrow keys)',
                            choices: empName
                        },
                        {
                            type: 'list',
                            name: 'updateEmpRole',
                            message: 'What is the new role? (Use arrow keys)',
                            choices: roleTitles
                        }
                    ])
                    //update mysql employees table with new role
                        .then((res) => {
                            const sql = 'UPDATE employees SET employee.role_id = ? WHERE employee.id = ?'
                            const params = [res.updateEmpChoice, res.updateEmpRole]
                            db.query(sql, params, (err, res) => {
                                if (err) {
                                    console.log(err)
                                }
                                console.table(res)
                                console.log('Employee role udpated.')
                                setTimeout(promptUser(), 2000)
                            })
                        })
                    })
                })
        }

//REMOVE DEPARTMENT (OPTIONAL BONUS)
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
            const sql = 'DELETE FROM departments WHERE department.id = (?)'
            const params = [res.removeDept]
            console.log('params = ' + JSON.stringify(params))

            db.query(sql, params, (err, res) => {
                if (err) {
                    console.log(err)
                }
                console.table(res)
            })
            console.log('The department has been removed.')
            setTimeout(promptUser(), 2000)
        })
    })
}

const end = () => {
    promptUser()
}

promptUser()