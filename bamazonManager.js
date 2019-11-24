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
    listMenu();
  });
  
function listMenu() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log("\n Welcome to Bamazon\n");
    productsMenu();
  });
}

function productsMenu() {
  inquirer
  .prompt([ 
    {
      name: "manager",
      type: "list",
      message: "Menu",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    }
  ]).then(function(answers){
    if (answers.manager === "View Products for Sale") {
        viewProducts();
    } else if (answers.manager === "View Low Inventory") {
      viewlowInventory();
    } else if (answers.manager === "Add to Inventory") {
      addToInventory();
    }else if (answers.manager === "Add New Product") {
      addNewProduct();
    }else {
      connection.end();
    }
  });
}

function viewProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log("\n Bamazon's Products \n --------------------");
    console.table(res);
    console.log("\n");
    productsMenu();
  });
}

function viewlowInventory() {
  connection.query("SELECT item_id, product_name, department_name, stock_quantity FROM products WHERE stock_quantity < 5", function(err, res){
    if (err) throw err;
    console.log("\nLow Inventory\n-------------");
    console.table(res);
    console.log("\n");
    productsMenu();
  });
}

function addToInventory() {
  
    inquirer
    .prompt([ 
      {
        name: "addInventory",
        type: "input",
        message: "Which items do you want to add to inventory? Please enter the item id",
        validate: function(value){
          if(isNaN(value) === false){
            return true;
          }
          return false;
        }
      }, {
        name: "quantity",
        type: "input",
        message: "How many units would you like to add?",
        validate: function(value){
          if(isNaN(value) === false){
            return true;
          }
          return false;
        }
      }
    ]).then(function(answers){
      connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
          let chosenId = parseFloat(answers.addInventory);
          let chosenQuantity = parseFloat(answers.quantity);
          let chosenProducts = res.find(row => row.item_id === chosenId); 
          let newQuantity = chosenQuantity + chosenProducts.stock_quantity;
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: newQuantity
              }, {
                item_id: chosenId
              }
            ],
            function(err) {
              if (err) throw err; 
                console.log(`\nSuccessfully, We have ${newQuantity} of ${chosenProducts.product_name}\n`);
                productsMenu();
            }
          ); 
      });
  });
}

function addNewProduct() {
    inquirer
    .prompt([ 
      {
        name: "productName",
        type: "input",
        message: "What product do you want to add?",
      }, {
        name: "departmentName",
        type: "input",
        message: "What department is the product in?",
      }, {
        name: "productPrice",
        type: "input",
        message: "How much is the product",
        validate: function(value){
          if(isNaN(value) === false){
            return true;
          }
          return false;
        }
      }, {
        name: "productQuantity",
        type: "input",
        message: "How many units do you want to add?",
        validate: function(value){
          if(isNaN(value) === false){
            return true;
          }
          return false;
        }
      }
    ]).then(function(answers){
      connection.query("INSERT INTO departments_data SET ?",
      {
        departments_name: answers.departmentName,
      },
        function(err) {
          if (err) throw err;
        }
      );
      connection.query("INSERT INTO products SET ?", 
      {
        product_name: answers.productName,
        department_name: answers.departmentName,
        price: answers.productPrice,
        stock_quantity: answers.productQuantity
      },
        function(err) {
          if (err) throw err; 
            console.log(`\n You successfully added ${answers.productQuantity} units of ${answers.productName}\n`);
            productsMenu();
        }
      );
    });    
}
