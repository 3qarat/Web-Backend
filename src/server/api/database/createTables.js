// createTables.js
import pool from "./index.js";

async function createTables() {
  try {
    // Create user table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user (
        id INT PRIMARY KEY AUTO_INCREMENT,
        google_id VARCHAR(255) NULL,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255),
        registration_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        mobile_num VARCHAR(20) NOT NULL,
        profile_picture VARCHAR(255) DEFAULT NULL,
        is_active TINYINT(1) NOT NULL DEFAULT 1
      )
    `);

    console.log("User table created successfully");

    // Create apartment table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS apartment (
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
        vr_link VARCHAR(255),
        status ENUM('rent', 'sold') NOT NULL,
        rate FLOAT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        view_count INT DEFAULT 0,
        user_id INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
      )
    `);

    console.log("Apartment table created successfully");

    // Create transactions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        tx_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        tx_type ENUM('rental', 'sale') NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        apartment_id INT NOT NULL,
        user_id INT NOT NULL,
        FOREIGN KEY (apartment_id) REFERENCES apartment(id),
        FOREIGN KEY (user_id) REFERENCES user(id)
      )
    `);

    console.log("Transactions table created successfully");

    // Create feedback table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id INT PRIMARY KEY AUTO_INCREMENT,
        comment TEXT NOT NULL,
        rating FLOAT NOT NULL,
        feedback_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        apartment_id INT NOT NULL,
        user_id INT NOT NULL,
        FOREIGN KEY (apartment_id) REFERENCES apartment(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
      )
    `);

    console.log("Feedback table created successfully");

    // Create apartment_photos table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS apartment_Photos (
        apartment_id INT NOT NULL,
        photos VARCHAR(255) NOT NULL,
        PRIMARY KEY (apartment_id, photos),
        FOREIGN KEY (apartment_id) REFERENCES apartment(id) ON DELETE CASCADE
      )
    `);

    console.log("Apartment Photos table created successfully");


    // Create rented_sold_apartments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rented_sold_apartments (
        apartment_id INT NOT NULL,
        user_id INT NOT NULL,
        PRIMARY KEY (apartment_id, user_id),
        FOREIGN KEY (apartment_id) REFERENCES apartment(id),
        FOREIGN KEY (user_id) REFERENCES user(id)
      )
    `);

    console.log("Rented Sold Apartments table created successfully");

    // Create password_reset_token table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS password_reset_token (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
      )
    `);

    console.log("Password Reset Token table created successfully");

    // create user_favorites table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_favorites (
      user_id INT,
      apartment_id INT,
      PRIMARY KEY (user_id, apartment_id),
      FOREIGN KEY (user_id) REFERENCES user(id),
      FOREIGN KEY (apartment_id) REFERENCES apartment(id)
  );
  `);

    console.log("user favorites table created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
}

export default createTables;
