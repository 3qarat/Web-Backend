CREATE TABLE apartment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('furnished apartment', 'apartments', 'chalets', 'villas') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    bedrooms INT NOT NULL,
    bathrooms INT NOT NULL,
    area DECIMAL(10, 2) NOT NULL,
    note TEXT,
    built_year YEAR NOT NULL,
    garages INT NOT NULL,
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    amenities JSON,
    education FLOAT,
    health FLOAT,
    transportation FLOAT,
    floor VARCHAR(255),
    vr_link VARCHAR(255)
    status ENUM('rent', 'sold') NOT NULL,
    rate FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

