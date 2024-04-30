CREATE TABLE apartment (
  id INT PRIMARY KEY AUTO_INCREMENT,
  location VARCHAR(255) NOT NULL,
  size INT NOT NULL,
  num_bedrooms INT NOT NULL,
  num_bathrooms INT NOT NULL,
  amenities TEXT,
  price DECIMAL(10,2) NOT NULL,
  status ENUM('available', 'rented', 'sold') NOT NULL,
  rate DECIMAL(10,1) DEFAULT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);