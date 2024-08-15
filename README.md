# AQARE Backend

AQARE is a Node.js-based backend application designed for an apartment rental platform. This project is part of my graduation requirements and includes features for user management, apartment listings, and more.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
## Features

- User authentication (local and Google)
- CRUD operations for apartments and user management
- View count tracking for apartments
- Favorites functionality for users
- Password reset functionality
- Custom error handling

## Technologies Used

- **Node.js** (ES6)
- **Express** for web framework
- **MySQL** as the database
- **Passport.js** for authentication
- **Docker** and **Docker Compose** for containerization
- **Git** and **GitHub** for version control
- **db-migrate** for database migrations

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/3qarat/Web-Backend.git
   cd Web-Backend/src/server


2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your MySQL database and update the configuration in `config.js`.

4. Run the migrations to set up the database:
   ```bash
   npx db-migrate up
   ```

5. Start the application:
   ```bash
   npm start
   ```

## Usage

Once the application is running, you can access the API endpoints at `http://localhost:PORT`, where `PORT` is the port defined in your configuration (default is usually 3000).

## API Endpoints

You can find the API endpoints and their details in the Postman collection linked below:

[API Postman Collection](https://documenter.getpostman.com/view/18620323/2sA3JDhQnh)

## Contributing

Contributions are welcome! Please create a pull request or open an issue if you find any bugs or have suggestions for improvements.
