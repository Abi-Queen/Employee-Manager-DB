
let departments = []
let roles = []
let employees = []

// create const objects to list dept names, role titles, employee everythings as choices in inquirer prompts
db.promise().query('SELECT * FROM departments')
    .then(([rows]) => {
        let deptNames = rows;
        departments = deptNames.map(({ id, name }) => ({
            name: name,
            value: id
        }))
        console.log("departments list = " + JSON.stringify(departments))
    })

db.promise().query('SELECT * FROM roles')
    .then(([rows]) => {
        let roleTitles = rows;
        roles = roleTitles.map(({ id, title }) => ({
            name: title,
            value: id
        }))
        console.log("roles list = " + JSON.stringify(roles))
    })

db.promise().query('SELECT * FROM employees')
    .then(([rows]) => {
        let employeesArray = rows;
        employees = employeesArray.map(({ id, first_name, last_name, email, department, role_id, manager_id }) => ({
            id: id,
            first_name: first_name,
            last_name: last_name,
            email: email,
            department: department,
            role_id: role_id,
            manager_id: manager_id
        }))
        console.log("employees list = " + JSON.stringify(employees))
    })


// from Mansi, turn inquirer inputs into mysql input, line 374
function removeDepartment() {
    db.query("SELECT * FROM department")
    .then(([rows]) => {
    let departments = rows;
    const departmentChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id
    }));
    prompt({
    type: "list",
    name: "departmentId",
    message:
    "Which department would you like to remove? (Warning: This will also remove associated roles and employees)",
    choices: departmentChoices
    })
    .then(res => db.removeDepartment(res.departmentId))
    .then(() => console.log(`Removed department from the database`))
    .then(() => loadMainPrompts())
    })
    }



inquirer.prompt([
    {
        type: 'list',
        name: 'allEmpChooseMgr',
        message: 'Which manager? (use arrow keys)',
        choices: [
            'Hillary Clinton',
            'Rosa Parks',
            'Harriet Tubman',
            'Eleanor Roosevelt',
            'Abigail Adams'
        ]
        }.then(function(res){
            if(res.allEmpChooseDept === 'Hillary Clinton')
            {
                viewAllEmpAdmin();
            }
            else if (res.allEmpChooseDept === 'Rosa Parks')
            {
                viewAllEmpSales();
            }
            else if (res.allEmpChooseDept === 'Harriet Tubman')
            {
                viewAllEmpLegal();
            }
            else if (res.allEmpChooseDept === 'Eleanor Roosevelt')
            {
                viewAllEmpEng();
            }
            else if (res.allEmpChooseDept === 'Abigail Adams')
            {
                viewAllEmpFin();
            }
        })
    ].then(promptUser())
);
};


// const updateEmpRole = () => {
//     //ask user to select an employee
//     //generate list of employees for inquirer prompt from employee table, save as employees
//     viewAllEmp()
//         .then(([rows]) => {
//             let employeeRows = rows
//             employees = employeeRows.map(({ id, first_name, last_name }) => ({
//                 name: `${first_name} ${last_name}`,
//                 value: id
//             }))
//             console.log(JSON.stringify(employees))
//         })
//         .then(([rows]) => {
//             let roleRows = rows
//             roles = roleRows.map(({ id, title }) => ({
//                 name: `${title}`,
//                 value: id
//             }))
//             console.log(JSON.stringify(roles))
//         })
//     inquirer.prompt([
//         {
//             type: 'list',
//             name: 'employeeChoice',
//             message: 'Which employee do you wish to update? (use arrow keys)',
//             choices: employees
//         },
//         {
//             type: 'list',
//             name: 'updateRoleChoice',
//             message: 'What will the new role be? (use arrow keys)',
//             choices: roles
//         }
//     ])
//         .then((res) => {
//             const sql = 'UPDATE employee SET employee.role_id = ? WHERE employee.id = ?'
//             const params = [res.employeeChoice.id, res.updateRoleChoice.id]
//             db.query(sql, params, (err, res) => {
//                 if (err) {
//                     console.log(err)
//                 }
//                 console.table(res)
//                 console.log('New employee added.')
//                 setTimeout(promptUser(), 2000)
//             })
//         })
//     //run get all employees query, same thing; keep that as list so it's in the array; then update the mapped array and send it back (update db)

// }