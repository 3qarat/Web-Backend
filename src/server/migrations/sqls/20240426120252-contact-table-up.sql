CREATE TABLE contact (
  user_id INT NOT NULL,
  mobile_num VARCHAR(20) NOT NULL UNIQUE,
  PRIMARY KEY (user_id, mobile_num),
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);