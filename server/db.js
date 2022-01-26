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
    const q = "SELECT * FROM users WHERE email = $1";
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

module.exports.getUserById = (id) => {
    const q = "SELECT * FROM users WHERE id = $1";
    const params = [id];
    return db.query(q, params);
};

module.exports.updateImage = (url, id) => {
    const q = `UPDATE users SET url=$1 WHERE id = $2 RETURNING url`;
    const params = [url, id];
    return db.query(q, params);
};

module.exports.updateBio = (bio, id) => {
    const q = `UPDATE users SET bio=$1 WHERE id = $2 RETURNING bio`;
    const params = [bio, id];
    return db.query(q, params);
};

module.exports.searchPeople = (val) => {
    const q = `SELECT first, last, id, url, bio FROM users WHERE first ILIKE $1`;
    const params = [val + "%"];
    return db.query(q, params);
};

module.exports.isFriend = (logedInId, viewedId) => {
    const q = `SELECT * FROM friendships WHERE (recipient_id = $1 AND sender_id = $2) OR (recipient_id = $2 AND sender_id = $1)`;
    const params = [logedInId, viewedId];
    return db.query(q, params);
};

module.exports.follow = (logedInId, viewedId) => {
    const q = `INSERT into friendships (sender_id, recipient_id) VALUES($1,$2) RETURNING *`;
    const params = [logedInId, viewedId];
    return db.query(q, params);
};

module.exports.cancelFollow = (logedInId, viewedId) => {
    const q = `DELETE FROM friendships WHERE sender_id = $1 AND recipient_id =$2`;
    const params = [logedInId, viewedId];
    return db.query(q, params);
};

module.exports.rejectFollow = (logedInId, viewedId) => {
    const q = `DELETE FROM friendships WHERE recipient_id = $1 AND sender_id = $2`;
    const params = [logedInId, viewedId];
    return db.query(q, params);
};

module.exports.acceptFollow = (logedInId, viewedId) => {
    const q = `UPDATE friendships SET accepted=true WHERE sender_id = $2 AND recipient_id =$1`;
    const params = [logedInId, viewedId];
    return db.query(q, params);
};

module.exports.unfollow = (logedInId, viewedId) => {
    const q = `DELETE FROM friendships WHERE (recipient_id = $1 AND sender_id = $2) OR (recipient_id = $2 AND sender_id = $1)`;
    const params = [logedInId, viewedId];
    return db.query(q, params);
};

module.exports.checkfollowing = (id) => {
    const q = `SELECT users.id, first, last, url, accepted
  FROM friendships
  JOIN users ON (accepted = FALSE AND recipient_id = $1 AND sender_id = users.id) OR
                (accepted = TRUE AND recipient_id = $1 AND sender_id = users.id) OR
                (accepted = TRUE AND sender_id = $1 AND recipient_id = users.id)`;

    const params = [id];
    return db.query(q, params);
};

module.exports.getLastTenMessages = () => {
    const q = `SELECT chat_messages.id AS chat_id, chat_messages.message AS message, chat_messages.created_at AS time, users.id AS user_id, users.first AS first, users.last AS last, users.url AS url FROM chat_messages JOIN users ON users.id = chat_messages.user_id ORDER BY chat_messages.id DESC LIMIT 50`;
    return db.query(q);
};

module.exports.addMessage = (user, message) => {
    const q = `INSERT into chat_messages (user_id, message) VALUES($1, $2) RETURNING id, created_at, message`;
    const params = [user, message];
    return db.query(q, params);
};

module.exports.deleteMessagesById = (id) => {
    const q = `DELETE FROM chat_messages WHERE user_id=$1`;
    const params = [id];
    return db.query(q, params);
};

module.exports.deleteFriendshipsById = (id) => {
    const q = `DELETE FROM friendships WHERE sender_id=$1 OR recipient_id =$1`;
    const params = [id];
    return db.query(q, params);
};

module.exports.deleteEmailFromPasswords = (email) => {
    const q = `DELETE FROM password_reset WHERE email=$1`;
    const params = [email];
    return db.query(q, params);
};

module.exports.deleteUser = (id) => {
    const q = `DELETE FROM users WHERE id=$1`;
    const params = [id];
    return db.query(q, params);
};
