const inquirer = require('inquirer');
const mysql = require('mysql'); 
// const {writeFile} = require('./utils/generatedb');
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
            else if (res.start === 'Add employee')
            {
                addEmp();
            }
            else if (res.start === 'Add department')
            {
                addDept();
            }
        });

        function viewAllEmp()
        {
            //mysql inputs, SELECT query
        }

        function addEmp()
        {
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
                    }
                },
            ]).then(function(addEmpLNRes){
                // mysql query
                // `insert into values (${last_name}, )
            }) 
            // chain a .then with response from db, if success, send back to menu above

                //mysql inputs
        };

        function addDept(){
            inquirer.prompt([
                {
                    type: 'input',
                    message: 'What is the name of the department?',

                }

            ]).then(function(deptRes){
                //INSEERT query here
                //`INSERT into departments VALUES (${dept_name}, )
            })
        }
        // only list prompt first, then if choices .then with promises, separate functions for each options; eg for each list choice
        {
            type: 'input',
            name: 'addEmpFirstName',
            message: 'What is employee first name?',
            validate: addEmpFirstNameInput => {
                if (addEmpFirstNameInput) {
                    return true;
                } else {
                    console.log('A name is needed');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'addEmployeeLastName',
            message: 'What is employee last name?',
            validate: addEmployeeLastNameInput => {
                    if (addEmployeeLastNameInput) {
                        return true;
                    } else {
                        console.log('A name is needed');
                        return false;
                    }
                }
        },
        {
            type: 'input',
            name: 'addEmployeeRole',
            message: 'What is employee role?'
        },
        {
            type: 'input',
            name: 'addEmployeeManager',
            message: 'Who is employee manager?'
        },
        {
            type: 'list',
            name: 'updateEmployeeRole',
            message: 'Whose role do you want to update? (use arrow keys)',
            choices: ['']
        }
    ])
};

promptUser()
.then(dbInputs => {
    fs.writeFileSync('./db.json', generateDb(dbInput), 'text');
});

