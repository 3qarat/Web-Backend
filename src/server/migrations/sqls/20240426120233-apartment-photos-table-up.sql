CREATE TABLE apartment_Photos (
  apartment_id INT NOT NULL,
  photos VARCHAR(255) NOT NULL,
  PRIMARY KEY (apartment_id, photos),
  FOREIGN KEY (apartment_id) REFERENCES apartment(id)
);