CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    date_of_birth DATE,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active',
    account_type VARCHAR(50) DEFAULT 'user',
    is_verified BOOLEAN DEFAULT FALSE,
    privacy_settings JSON,
    profile_picture VARCHAR(255),
    location VARCHAR(255),
    contact_number VARCHAR(20)
);


CREATE INDEX idx_users_status ON users (status);


CREATE INDEX idx_users_created_at ON users (created_at);


CREATE INDEX idx_users_updated_at ON users (updated_at);


