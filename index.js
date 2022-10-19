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
    const sql = `SELECT * FROM employees WHERE department = ?`
    const params = [res.params.id];
    
    db.query(sql, params, (err, rows) => {
        if (err) {
            console.log(err);
        }
        console.log(rows);
        })
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
    }
};


