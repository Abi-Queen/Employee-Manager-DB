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