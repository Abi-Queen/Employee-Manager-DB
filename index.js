const inquirer = require('inquirer');
const mysql = require('mysql'); 
const fs = require('fs'); 
const db = require('./db/connection');

// capture user input answering inquirer prompts
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

function viewAllEmpMgr() {
    //still working on this one... not sure if it should use group by or desc on mgr id and then fk to display mgr name?
    db.query(`DISPLAY employees GROUP BY manager_id;`, (err, result) => {
        if(err) {
            console.log(err);
        }
        console.log(result);
    });
    //need to return to prompt for these?
};

//view employees by dept functions
function viewAllEmpAdmin() {
    db.query(`SELECT * FROM employees WHERE dept_id = 1`, (err, row) => {
        if(err) {
            console.log(err);
        }
        console.log(row);
    });
    //need to return to prompt for these?
};
function viewAllEmpSales() {
    db.query(`SELECT * FROM employees WHERE dept_id = 2`, (err, row) => {
        if(err) {
            console.log(err);
        }
        console.log(row);
    });
};
function viewAllEmpEngineering() {
    db.query(`SELECT * FROM employees WHERE dept_id = 3`, (err, row) => {
        if(err) {
            console.log(err);
        }
        console.log(row);
    });
};
function viewAllEmpFin() {
    db.query(`SELECT * FROM employees WHERE dept_id = 4`, (err, row) => {
        if(err) {
            console.log(err);
        }
        console.log(row);
    });
};
function viewAllEmpLegal() {
    db.query(`SELECT * FROM employees WHERE dept_id = 5`, (err, row) => {
        if(err) {
            console.log(err);
        }
        console.log(row);
    });
};

function viewAllDept() {
    db.query(`SELECT * FROM departments`, (err, row) => {
        if(err) {
            console.log(err);
        }
        console.log(row);
    }
    );
    promptUser();
};

function removeEmp() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'removeEmpChoose',
            message: 'Which employee would you like to remove? (use arrow keys)',
            choices: [
                // how to get these choices from current table vs. hard coded? list by id? by (?,?,?) query function? write a function to generate list items from column?
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
};
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
        const params = [1, addEmpLNInput, addEmpFNInput, addEmpEmailInput];
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
        // addDeptRes???
        const sql = `INSERT INTO departments (id, name, manager)
        VALUES (?,?,?)`;
        const params = [1, addDeptNameInput, addDeptMgrInput];
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

function removeDept() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'removeDeptChoose',
            message: 'Which department? (use arrow keys)',
            choices: [
                'Admin',
                'Sales',
                'Engineering',
                'Finance',
                'Legal'
            ]
            }.then(function(res){
                // or is there a way to get the user input as (?,?,?) and have only one function using that value?
                if(res.removeDeptChoose === 'Admin')
                {
                    removeDeptAdmin();
                }
                else if (res.removeDeptChoose === 'Sales')
                {
                    removeDeptSales();
                }
                else if (res.removeDeptChoose === 'Engineering')
                {
                    removeDeptEngineering();
                }
                else if (res.removeDeptChoose === 'Finance')
                {
                    removeDeptFinance();
                }
                else if (res.removeDeptChoose === 'Legal')
                {
                    removeDeptLegal();
                }
            })
        ].then(promptUser())
    );
    promptUser();
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