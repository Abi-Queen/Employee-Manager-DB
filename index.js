const inquirer = require('inquirer')
const cTable = require('console.table')
const db = require('./db/connection')
let departments = []
let roles = []
let employees = []

//create const objects to list dept names, role titles, employee everythings as choices in inquirer prompts
db.promise().query('SELECT * FROM departments')
.then(([rows]) => {
    let deptNames = rows;
    departments = deptNames.map(({ id, name }) => ({
        name: name,
        value: id
    }))
console.log("departments list = " + JSON.stringify(departments))})
    
db.promise().query('SELECT * FROM roles')
.then(([rows]) => {
    let roleTitles = rows;
    roles = roleTitles.map(({ id, title }) => ({
        name: title,
        value: id
    }))
// console.log("roles list = " + JSON.stringify(roles))
})

db.promise().query('SELECT * FROM employees')
.then(([rows]) => {
    let employeesArray = rows;
    employees = employeesArray.map(({ id, first_name, last_name, email, department, role_id, manager_id}) => ({
        id: id,
        first_name: first_name,
        last_name: last_name,
        email: email,
        department: department,
        role_id: role_id,
        manager_id: manager_id
    }))
console.log("employees list = " + JSON.stringify(employees))})

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
            else if (res.start === 'Remove a department')
            {
                removeDept()
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
// HELP how to display role title instead of id (use "AS roles.title"?)
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
    // promptUser()
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
        const params = [res.newDeptName]
        console.log('params = ' + JSON.stringify(params))

        db.query(sql, params, (err, res) => {
            if(err) {
                console.log(err)
            }
            console.table(res)
        })
        console.log('New department added.')
    })
    // promptUser()
    viewAllDept()
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
            type: 'list',
            name: 'newRoleDept',
            message: 'To which department does the new role belong? (Use arrow keys)',
            choices: departments
        }
    ])
    //insert into roles table
    //how to get department_id INT instead of department name?
    .then((res) => {
        const sql = 'INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)'
        const params = [res.newRoleTitle, res.newRoleSalary, res.newRoleDept]
        //with or without .id?
        db.query(sql, params, (err, res) => {
            if(err) {
                console.log(err)
            }
            console.table(res)
        })
        console.log('Role added.')
    })
    // promptUser()
}

//user inputs new employee values (first_name, last_name, email, role_id); add to db
const addEmp = () => {
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
            type: 'choice',
            name: 'newEmpRole',
            message: 'What is the role of the new employee? (Use arrow keys)',
            choices: roleChoices
        }
    ])
    //insert into emmployees table
    //HELP how to get role_id rather than title???
    .then((res) => {
        const sql = 'INSERT INTO employees (first_name, last_name, email, role_id) VALUES (?,?,?,?)'
        const params = [res.newEmpFN.id, res.newEmpLN.id, res.newEmpEmail.id, res.newEmpRole.id]
        db.query(sql, params, (err, res) => {
            if(err) {
                console.log(err)
            }
            console.table(res)
        })
        console.log('Employee added.')
    })
    promptUser()
}

const updateEmpRole = () => {
    //ask user to select an employee
    //generate list of employees for inquirer prompt from employee table, save as employees
    //HELP is this SELECT query correct?
    inquirer.prompt([
        {
            type: 'list',
            name: 'updateEmpChoice',
            message: 'Which employee do you wish to update? (use arrow keys)',
            choices: viewAllEmp()
        },
        {
            type: 'list',
            name: 'updateEmpRoleChoice',
            message: 'What is the new role of the employee? (use arrow keys)',
            choices: roles
        }
        ])
        // .then((res) => {
            //HELP how to get role_title vs. role_id, employee_id from fn/ln inquirer input?
            // const sql = 'UPDATE employees SET role_title = ? WHERE employee_id = ?'
            // const params = 
}

const removeDept = () => {
    inquirer.prompt([
        {
            type: 'choice',
            name: 'removeDept',
            message: 'Which department do you wish to remove? (use arrow keys)',
            choices: departments
        }
    ])
    .then((res) => {
        const sql = 'DELETE FROM departments WHERE department.id = (?)'
        const params = [res.removeDept]
        console.log('params = ' + JSON.stringify(params))

        db.query(sql, params, (err, res) => {
            if(err) {
                console.log(err)
            }
            console.table(res)
        })
        console.log('The department has been removed.')
    })
    promptUser()
}

const end = () => {
    promptUser()
}

promptUser()