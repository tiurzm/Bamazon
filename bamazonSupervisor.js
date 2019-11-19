const mysql = require("mysql");
const inquirer = require("inquirer");


const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "departments_DB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    departmentsMenu();
});

function departmentsMenu() {
    inquirer
    .prompt([ 
        {
        name: "supervisor",
        type: "list",
        message: "Menu",
        choices: ["View Product Sales by Department", "Create New Department", "Exit"]  
        }
    ]).then(function(answers){
        if(answers.supervisor === "View Product Sales by Department"){
            viewDepartment(); 
        } else if (answers.supervisor === "Create New Department"){
            createDepartment();
        } else {
            connection.end();
        }        
    });
}

function viewDepartment() {
    
}
