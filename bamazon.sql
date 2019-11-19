DROP DATABASE IF EXISTS bamazon_DB;
CREATE database bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
  `item_id` INT AUTO_INCREMENT NOT NULL,
  `product_name` VARCHAR(100) NULL,
  `department_name` VARCHAR(100) NULL,
  `price` DECIMAL(4,2) NULL,
  `stock_quantity` INT,
  `product_sales` INT,

  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Blenders", "Kitchen", 24.49, 30), ("Baby Doll", "Toys", 16.99, 22), ("Sneakers", "Shoes", 23, 15), ("Floor Mats", "Home", 14.24, 27), ("Dog Food", "Pets", 12.39, 35), ("Bodysuits", "Baby", 14.95, 19), ("Lipstick", "Beauty", 7.89, 20), ("Chairs", "Furniture", 40, 31), ("Games", "Video Games", 48, 24), ("Blu-ray Movies", "Movies", 23.49, 10);

SELECT * FROM products;
