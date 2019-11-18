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
      console.log("\n Welcome to Bamazon");
      console.log("--------------------");
      for (let i = 0; i < res.length; i++){
        console.log(res[i].item_id + "|" + res[i].product_name + "|" + res[i].department_name + "|" + res[i].price + "|" +res[i].stock_quantity);
      }
      console.log("\n");
      

      connection.end();
  });
}