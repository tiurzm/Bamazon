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
    displayProducts();
  });
  
function displayProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
      console.log("\n Welcome to Bamazon\n--------------------");
      for (let i = 0; i < res.length; i++){
        console.log(`${res[i].item_id}| ${res[i].product_name}| ${res[i].department_name}| ${res[i].price}| ${res[i].stock_quantity}`);
      }
      console.log("\n");
      buyProducts();
  });
}

function buyProducts(){
  connection.query("SELECT * FROM products", function(err, res){
    if (err) throw err;
    inquirer
    .prompt([ 
      {
        name: "buy",
        type: "input",
        message: "Would you like to buy something? Please enter the item id!",
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
      let chosenId = parseFloat(answers.buy);
      let chosenQuantity = parseFloat(answers.quantity);
      let chosenProducts = res.find(row => row.item_id === chosenId); 
      // console.log(chosenProducts);
      let newQuantity = chosenProducts.stock_quantity - chosenQuantity;
      if(chosenQuantity < chosenProducts.stock_quantity){
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
            // total
            console.log(`\nYour order has completed\n`);
          }
        ); 
      } else {
        console.log("\nInsufficient quantity\n");
      }
      connection.end();
    });
  });
}


