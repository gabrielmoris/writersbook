DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS password_reset;

CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      first VARCHAR(255) NOT NULL CHECK (first != ''),
      last VARCHAR(255) NOT NULL CHECK (last != ''),
      email VARCHAR(255) NOT NULL UNIQUE CHECK (email != ''),
      password VARCHAR(255) NOT NULL CHECK (password != ''),
      url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

CREATE TABLE password_reset(
      code VARCHAR(255) NOT NULL CHECK (code != ''),
      email VARCHAR(255) NOT NULL UNIQUE CHECK (email != ''),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);