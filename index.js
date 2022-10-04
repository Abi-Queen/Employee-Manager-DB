const inquirer = require('inquirer');
const mysql = require('mysql'); 
const fs = require('fs'); 

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
    db.query(`DELETE FROM employees WHERE id = ?`, (err, result) => {
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
        // addEmpRes???
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


