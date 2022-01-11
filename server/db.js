const spicedPg = require("spiced-pg");

const database = "socialmedia"; //<---this is the database I already have in my PC
const username = "onionpetition";
const password = "onion";

//communication with the database
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${username}:${password}@localhost:5432/${database}`
);

console.log(`[db] connecting to the database-> ${database}`);

module.exports.addUser = (userName, userLastName, userEmail, userPasword) => {
    const q = `INSERT INTO users (first, last, email, password) Values($1,$2,$3,$4)
    RETURNING *`;
    const params = [userName, userLastName, userEmail, userPasword];
    return db.query(q, params);
};

module.exports.getUser = (email) => {
    const q = "SELECT email, password, id FROM users WHERE email = $1";
    const params = [email];
    return db.query(q, params);
};

module.exports.checkFromReset = (email) => {
    const q = "SELECT email, created_at FROM password_reset WHERE email = $1";
    const params = [email];
    return db.query(q, params);
};

module.exports.updateCode = (code, email) => {
    const q = `UPDATE password_reset SET code=$1 WHERE email = $2`;
    const params = [code, email];
    return db.query(q, params);
};

module.exports.createFirstCode = (code, email) => {
    const q = `INSERT into password_reset (code, email) VALUES($1,$2) RETURNING *`;
    const params = [code, email];
    return db.query(q, params);
};

module.exports.checkCode = (email) => {
    const q = `SELECT code from password_reset WHERE email=$1`;
    const params = [email];
    return db.query(q, params);
};

module.exports.updatePassword = (password, email) => {
    const q = `UPDATE users SET password=$1 WHERE email = $2`;
    const params = [password, email];
    return db.query(q, params);
};
