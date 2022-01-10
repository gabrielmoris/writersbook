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

module.exports.addUser = (
    userName,
    userLastName,
    userEmail,
    userPasword
) => {
    const q = `INSERT INTO users (first, last, email, password) Values($1,$2,$3,$4)
    RETURNING *`;
    const params = [userName, userLastName, userEmail, userPasword];
    return db.query(q, params);
};