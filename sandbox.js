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