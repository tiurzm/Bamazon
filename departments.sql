DROP DATABASE IF EXISTS departments_DB;
CREATE database departments_DB;

USE departments_DB;

CREATE TABLE departments_data (
  `department_id` INT AUTO_INCREMENT NOT NULL,
  `department_name` VARCHAR(100) NULL,
  `over_head_costs` INT,
  PRIMARY KEY (item_id)
);

SELECT * FROM departments_data;
