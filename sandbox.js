
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

const db = require("./db/connection");

// main menu, ask user what they want to do in the app; if statements trigger individual functions
const promptUser = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'start',
            message: 'What would you like to do? (use arrow keys)',
            choices: [
                'View all employees',
                'View all employees by department',
                'View all employees by manager',
                'Add employee',
                'Remove employee',
                'Update employee role',
                'Update manager',
                'View all roles',
                'Add role',
                'Remove role', 
                'View all departments', 
                'Add department',
                'Remove department',
                'View total payroll by department',
                'Quit'
            ]
        }.then(function(res){
            if(res.start === 'View all employees')
            {
                viewAllEmp();
            }
            else if (res.start === 'View all employees by department')
            {
                viewAllEmpDept();
            }
            else if (res.start === 'View all employees by manager')
            {
                viewAllEmpMgr();
            }
            else if (res.start === 'Add employee')
            {
                addEmp();
            }
            else if (res.start === 'Remove employee')
            {
                removeEmp();
            }
            else if (res.start === 'Update employee role')
            {
                updateRole();
            }
            else if (res.start === 'Update manager')
            {
                updateMgr();
            }
            else if (res.start === 'View all roles')
            {
                viewAllRoles();
            }
            else if (res.start === 'Add role')
            {
                addRole();
            }
            else if (res.start === 'Remove role')
            {
                removeRole();
            }
            else if (res.start === 'View all departments')
            {
                viewAllDept();
            }
            else if (res.start === 'Add department')
            {
                addDept();
            }
            else if (res.start === 'Remove department')
            {
                removeDept();
            }
            else if (res.start === 'View total payroll by department')
            {
                viewTotalPayrollByDept();
            }
            else if (res.start === 'Quit')
            {
                quit();
            }
        })
    ]);
};

//display full employees table
function viewAllEmp() {
    db.query(`SELECT * FROM employees`, (err, row) => {
        if (err) {
            console.log(err);
        }
        console.log(row);
    }
    );
    promptUser();
};


function viewAllEmpDept() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'allEmpChooseDept',
            message: 'Which department? (use arrow keys)',
            choices: [
                'Admin',
                'Sales',
                'Engineering',
                'Finance',
                'Legal'
            ]
            }.then(function(res){
                if(res.allEmpChooseDept === 'Admin')
                {
                    viewAllEmpAdmin();
                }
                else if (res.allEmpChooseDept === 'Sales')
                {
                    viewAllEmpSales();
                }
                else if (res.allEmpChooseDept === 'Legal')
                {
                    viewAllEmpLegal();
                }
                else if (res.allEmpChooseDept === 'Engineering')
                {
                    viewAllEmpEng();
                }
                else if (res.allEmpChooseDept === 'Finance')
                {
                    viewAllEmpFin();
                }
            })
        ].then(promptUser())
    );
};

//from Mansi
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


    // Create a candidate
router.post('/candidate', ({ body }, res) => {
    const errors = inputCheck(
      body,
      'first_name',
      'last_name',
      'industry_connected'
    );
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
  
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected, party_id) VALUES (?,?,?,?)`;
    const params = [
      body.first_name,
      body.last_name,
      body.industry_connected,
      body.party_id
    ];
  
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: body
      });
    });
  });

//MODEL UPDATE QUERY
  const sql = `UPDATE candidates SET party_id = ?
  WHERE id = ?`;
const params = [req.body.party_id, req.params.id];
db.query(sql, params, (err, result) => {
  if(err) {
      res.status(400).json({ error: err.message });
      //check if a record was found
  } else if (!result.affectedRows) {
      res.json({
          message: 'candidate was not found'
      });
  } else {
      res.json({
          message: 'success',
          data: req.body,
          changes: result.affectedRows
      });
  }
});


function viewAllEmpDept() {
    const sql = `SELECT * FROM employees WHERE department = ?`;
    const params = [req.params.id];
    
    db.query(sql, params, (row) => {
        
    })
    db.query(`SELECT * FROM employees WHERE department = ?`)
    .then(([rows]) => {
        let employees = rows;
        const viewAllEmpDeptSelected = employees.map(({ id, name }) =>
        ({
            name: name,
            value: id
        }));
        inquirer.prompt([
        {
            type: 'list',
            name: 'allEmpDeptChoices',
            message: 'Which department?',
            choices: viewAllEmpDeptSelected
        }])
        .then(res => db.viewAllEmpDept(res.allEmpDeptChoices))
        .then(() => console.log('Employees by department.'))
        .then(() => promptUser())
    })
};

function removeEmp() {
    db.query('SELECT * FROM employees')
    .then(([rows]) => {
        let employees = rows;
        const empChoice = employees.map(({ id, name }) =>
        ({ 
            name: name,
            value: id
        }));
        prompt({
            type: 'list',
            name: 'employeeId',
            message: 'Which employee would you like to remove? (Use arrow keys)',
            choices: empChoice
        })
        .then(res => db.removeEmployee(res.employeeId))
        .then(() => console.log('Removed employee from database.'))
        .then(() => promptUser())
    })
};

    inquirer.prompt([
        {
            type: 'list',
            name: 'removeEmpChoose',
            message: 'Which employee would you like to remove? (use arrow keys)',
            choices: [
                // how to get these choices from current table vs. hard coded? list by id? by (?,?,?) query function? write a function to generate list items from column?
                // choices need to be from select*employees
                'Puck Sprite',
                'Buzz Lightyear',
                'Lighthing McQueen',
                'Donald Duck',
                'Bugs Bunny',
                'Elmer Fudd',
                'Mike Mulligan',
                'Peter Rabbit',
                'Octavian Caesar Augustus',
                'Julius Caesar'
            ]
            }.then(function(res){
                if(res.removeEmpChoose === 'Puck Sprite')
                {
                    removeEmpPuck();
                }
                else if (res.removeEmpChoose === 'Buzz Lightyear')
                {
                    removeEmpBuzz();
                }
            })
        ].then(promptUser())
    );
    promptUser();

function removeEmpPuck() {
    db.query(`DELETE FROM employees WHERE first_name = Puck`, (err, result) => {
        if(err) {
            console.log(err);
        }
        console.log(result);
    }
    );
    promptUser();
};
function removeEmpBuzz() {
    db.query(`DELETE FROM employees WHERE first_name = Buzz`, (err, result) => {
        if(err) {
            console.log(err);
        }
        console.log(result);
    }
    );
    promptUser();
};

function addEmp() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addEmpLN',
            message: 'What is employee last name?',
            validate: addEmpLNInput => {
                if (addEmpLNInput) {
                    return true;
                } else {
                    console.log('A name is needed');
                    return false;
                }
            },
            type: 'input',
            name: 'addEmpFN',
            message: 'What is employee first name?',
            validate: addEmpFNInput => {
                if (addEmpFNInput) {
                    return true;
                } else {
                    console.log('A name is needed');
                    return false;
                }
            },
            type: 'input',
            name: 'addEmpEmail',
            message: 'What is employee email?'
        }
    ]).then(function(addEmpRes){
        // what is addEmpRes???
        const sql = `INSERT INTO employees (id, last_name, first_name, email)
        VALUES (?,?,?,?)`;
        const params = [1, addEmpRes.addEmpLNInput, addEmpFNInput, addEmpEmailInput];
        db.query(sql, params, (err, result) => {
            if(err) {
                console.log(err);
            }
            console.log(result);
        });
        },
        // `insert into values (${last_name}, ) ???
        );
    promptUser();
};

function addDept() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDeptName',
            message: 'What is the name of the department?',
            validate: addDeptNameInput => {
                if (addDeptNameInput) {
                    return true;
                } else {
                    console.log('A name is needed');
                    return false;
                }
            },
            type: 'input',
            name: 'addDeptMgr',
            message: 'Who is the manager of the department?',
            validate: addDeptMgrInput => {
                if (addDeptMgrInput) {
                    return true;
                } else {
                    console.log('A name is needed');
                    return false;
                }
            },
        }
    ]).then(function(addDeptRes){
        const sql = `INSERT INTO departments (name, manager)
        VALUES (?,?)`;
        const params = [addDeptRes.addDeptNameInput, addDeptRes.addDeptMgrInput];
        db.query(sql, params, (err, result) => {
            if(err) {
                console.log(err);
            }
            console.log(result);
        });
        },
        );
    promptUser();
};

function removeDept() {
    db.query('DELETE FROM departments WHERE id = ?')
    .then(([rows]) => {
        let departments = rows;
        const departmentChoices = departments.map(({ id, name }) => ({
            name: name,
            value: id
        }));
        inquirer.prompt([
            {
            type: 'list',
            name: 'departmentId',
            message: 'Which department would you like to remove?',
            choices: departmentChoices
        }]
        .then(res => db.removeDept(res.departmentId)
        .then(db.query(sql, req.params.id, (err, result) => {
            if (err) {
                res.status(400).json({ error: res.message });
            } else {
                res.json({})
            }
        };
        .then(`DELETE FROM candidates WHERE id = ?`
            res => db.removeDept(res.departmentId))
        .then(db.query(sql, req.params.id, (err, result) => {
            if (err) {
              res.status(400).json({ error: res.message });
            } else {
              res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
              });
            }
          });
          (db.query(''))
        .then(() => console.log('Removed department'))
        .then(() => promptUser())
    };


function removeDeptAdmin() {
    db.query(`DELETE FROM department WHERE name = Admin`, (err, result) => {
        if(err) {
            console.log(err);
        }
        console.log(result);
    }
    );
    promptUser();
};
function removeDeptSales() {
    db.query(`DELETE FROM department WHERE name = Sales`, (err, result) => {
        if(err) {
            console.log(err);
        }
        console.log(result);
    }
    );
    promptUser();
};
function removeDeptEngineering() {
    db.query(`DELETE FROM department WHERE name = Engineering`, (err, result) => {
        if(err) {
            console.log(err);
        }
        console.log(result);
    }
    );
    promptUser();
};
function removeDeptFinance() {
    db.query(`DELETE FROM department WHERE name = Finance`, (err, result) => {
        if(err) {
            console.log(err);
        }
        console.log(result);
    }
    );
    promptUser();
};
function removeDeptLegal() {
    db.query(`DELETE FROM department WHERE name = Legal`, (err, result) => {
        if(err) {
            console.log(err);
        }
        console.log(result);
    }
    );
    promptUser();
};

            // employees.filter(emp => emp.departments === res)
            // console.log('emp = ' + emp)
