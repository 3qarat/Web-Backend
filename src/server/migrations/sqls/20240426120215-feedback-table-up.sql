CREATE TABLE feedback (
  id INT PRIMARY KEY AUTO_INCREMENT,
  rating INT NOT NULL,
  feedback_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  apartment_id INT NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (apartment_id) REFERENCES apartment(id),
  FOREIGN KEY (user_id) REFERENCES user(id)
);