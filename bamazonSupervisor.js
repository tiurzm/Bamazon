const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "bamazon_DB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected successfully");
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
    const query = "SELECT department_id, departments_name, over_head_costs, COALESCE(product_sales, 0) AS product_sales FROM products RIGHT JOIN departments_data ON products.department_name = departments_data.departments_name ORDER BY department_id;";
    connection.query(query, function(err, res) {
        if (err) throw err;
          console.log("\nWelcome to Bamazon");
          console.table(res);
          console.log("\n");
          departmentsMenu();
    });
}

function createDepartment() {
    inquirer 
        .prompt([
            {
                name: "departmentName",
                type: "input",
                message: "What is deparment's name?"
            }
        ]).then(function(answers){
            connection.query(
                "INSERT INTO departments_data SET ?",
                {
                    departments_name: answers.departmentName,
                },
                function(err) {
                    if (err) throw err; 
                        console.log(`\n You successfully added a new department\n`);
                        departmentsMenu();
                }
            );
    });
}

