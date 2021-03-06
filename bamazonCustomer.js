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
    displayProducts();
});
  
function displayProducts() {
  connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", function(err, res) {
    if (err) throw err;
      console.log("\nWelcome to Bamazon");
      console.table(res);
      console.log("\n");
      exit();
  });
}

function exit() {
  inquirer
    .prompt([
      {
        name: "confirm",
        type: "confirm",
        message: "Would you like to buy something?",
        default: true
      }
    ]).then(function(answers){
        if(answers.confirm) {
          buyProducts();
        } else {
          console.log("\nCome again anytime\n");
          connection.end();
        }
    });
}

function buyProducts(){
  inquirer
    .prompt([ 
      {
        name: "buy",
        type: "input",
        message: "Please enter the item id!",
        validate: function(value){
          if(isNaN(value) === false){
            return true;
          }
          return false;
        }
      }, {
        name: "quantity",
        type: "input",
        message: "How many units would you like to buy?",
        validate: function(value){
          if(isNaN(value) === false){
            return true;
          }
          return false;
        }
      }
    ]).then(function(answers){
      connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", function(err, res){
        if (err) throw err;
          let chosenId = parseFloat(answers.buy);
          let chosenQuantity = parseFloat(answers.quantity);
          let chosenProducts = res.find(row => row.item_id === chosenId); 
          // console.log(chosenProducts);
          let newQuantity = chosenProducts.stock_quantity - chosenQuantity;
          let totalPrice = (chosenProducts.price * chosenQuantity).toFixed();
            if(chosenQuantity <= chosenProducts.stock_quantity){
              connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                  {
                    stock_quantity: newQuantity,
                    product_sales: totalPrice
                  }, {
                    item_id: chosenId
              }   
                ],
                function(err) {
                  if (err) throw err;
                  // total
                  console.log(`\nYour order has completed. Total = $${totalPrice}\n`);
                }
              ); 
            }     else {
              console.log("\nI am sorry, we don't have enough stock");
            }
            connection.end();
      });
    });
}



