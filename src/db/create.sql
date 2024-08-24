/**
*** Create table
**/
CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(15),
    created_at INT NOT NULL
);

/**
*** Add dummy users
**/
INSERT INTO User (name, email, phone_number, created_at)
VALUES
('Alice Johnson', 'alice@example.com', '1234567890', 1724508040),
('Bob Smith', 'bob@example.com', '0987654321', 1724508041),
('Charlie Brown', 'charlie@example.com', '5551234567', 1724508042);