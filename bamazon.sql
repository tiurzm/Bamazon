DROP DATABASE IF EXISTS bamazon_DB;
CREATE database bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
  `item_id` INT AUTO_INCREMENT NOT NULL,
  `product_name` VARCHAR(100) NULL,
  `department_name` VARCHAR(100) NULL,
  `price` DECIMAL(4,2) NULL,
  `stock_quantity` INT,
  `product_sales` INT DEFAULT "0",
  PRIMARY KEY (item_id)
);

CREATE TABLE departments_data (
  `department_id` INT AUTO_INCREMENT NOT NULL,
  -- `department_id` INT,
  `departments_name` VARCHAR(100) NULL,
  `over_head_costs` INT DEFAULT "0", 
  PRIMARY KEY (department_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Floor Mats", "Home", 14.24, 27), ("Lipstick", "Beauty", 7.89, 20), ("Blenders", "Kitchen", 24.49, 30), ("Games", "Video Games", 48, 24), ("Baby Doll", "Toys", 16.99, 22), ("Chairs", "Furniture", 40, 31), ("Sneakers", "Shoes", 23, 15), ("Dog Food", "Pets", 12.39, 35), ("Bodysuits", "Baby", 14.95, 19), ("Blu-ray Movies", "Movies", 23.49, 10), ("Boots", "Shoes", 38, 20);

INSERT INTO departments_data (departments_name)
VALUES ("Kitchen"), ("Home"), ("Furniture"), ("Toys"), ("Beauty"), ("Baby"), ("Shoes"), ("Pets"), ("Video Games"), ("Movies");

SELECT * FROM products;
SELECT * FROM departments_data;


SELECT department_id, departments_name, over_head_costs, product_sales
FROM products 
INNER JOIN departments_data ON products.department_name = departments_data.departments_name;