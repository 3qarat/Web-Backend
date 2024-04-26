CREATE TABLE transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tx_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tx_type ENUM('rental', 'sale') NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  apartment_id INT NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (apartment_id) REFERENCES apartment(id),
  FOREIGN KEY (user_id) REFERENCES user(id)
);