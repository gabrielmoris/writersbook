DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS password_reset;
DROP TABLE IF EXISTS friendships;

CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      first VARCHAR(255) NOT NULL CHECK (first != ''),
      last VARCHAR(255) NOT NULL CHECK (last != ''),
      email VARCHAR(255) NOT NULL UNIQUE CHECK (email != ''),
      password VARCHAR(255) NOT NULL CHECK (password != ''),
      url VARCHAR,
      bio VARCHAR,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

CREATE TABLE password_reset(
      code VARCHAR(255) NOT NULL CHECK (code != ''),
      email VARCHAR(255) NOT NULL UNIQUE CHECK (email != ''),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

 CREATE TABLE friendships( 
  id SERIAL PRIMARY KEY, 
  sender_id INT REFERENCES users(id) NOT NULL,
  recipient_id INT REFERENCES users(id) NOT NULL,
  accepted BOOLEAN DEFAULT false);