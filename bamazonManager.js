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
  database: "bamazon_DB"
});

connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
    listMenu();
  });
  
function listMenu() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log("\n Welcome to Bamazon\n");
    menuProducts();
  });
}

function menuProducts() {
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
    for (let i = 0; i < res.length; i++){
      console.log(res[i].item_id + "|" + res[i].product_name + "|" + res[i].department_name + "|" + res[i].price + "|" +res[i].stock_quantity);
    }
    console.log("\n");
    menuProducts();
  });
}

function viewlowInventory() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // console.log(res);
    console.log("\nLow Inventory\n-------------");
    for (let i = 0; i < res.length; i++){
      if(res[i].stock_quantity < 5){
        console.log(`${res[i].product_name}| ${res[i].stock_quantity}`);
      }
    }
    // Do i have to put if else statement for low inventory?
    console.log("\n");
    menuProducts();
  });
}

function addToInventory() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
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
            menuProducts();
        }
      ); 
    });
  });
}

function addNewProduct() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
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
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answers.productName,
          department_name: answers.departmentName,
          price: answers.productPrice,
          stock_quantity: answers.productQuantity
        },
        function(err) {
          if (err) throw err; 
            console.log(`\n You successfully added ${answers.productQuantity} units of ${answers.productName}\n`);
            menuProducts();
        }
      );
    });    
  });
}
