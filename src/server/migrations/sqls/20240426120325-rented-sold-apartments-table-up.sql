CREATE TABLE rented_sold_apartments (
  apartment_id INT NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY (apartment_id, user_id),
  FOREIGN KEY (apartment_id) REFERENCES apartment(id),
  FOREIGN KEY (user_id) REFERENCES user(id)
);