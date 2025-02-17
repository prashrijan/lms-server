# Library Management System - Server

## Overview

This is the server-side component of the Library Management System. It provides APIs for managing books, users, and transactions in the library.

## Features

-   User authentication and authorization
-   CRUD operations for books and users
-   Borrow and return book transactions
-   Search functionality

## Technologies Used

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   JWT for authentication

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/Library-Management-System.git
    ```
2. Navigate to the server directory:
    ```sh
    cd Library-Management-System/server
    ```
3. Install dependencies:
    ```sh
    npm install
    ```

## Configuration

1. Create a `.env` file in the server directory and add the following environment variables:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

## Running the Server

Start the server:

```sh
npm start
```

The server will run on `http://localhost:5000`.

## API Endpoints

-   `POST /api/auth/register` - Register a new user
-   `POST /api/auth/login` - Login a user
-   `GET /api/books` - Get all books
-   `POST /api/books` - Add a new book
-   `PUT /api/books/:id` - Update a book
-   `DELETE /api/books/:id` - Delete a book
-   `POST /api/transactions/borrow` - Borrow a book
-   `POST /api/transactions/return` - Return a book

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
