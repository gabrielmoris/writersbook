const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db.js");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bcrypt");
const { sendEmail } = require("./ses.js");
const cryptoRandomString = require("crypto-random-string");
const { uploader } = require("./uploader.js");
const s3 = require("./s3");
const SocketIOServer = require("socket.io");
const server = require("http").Server(app);

//=======SOCKET IO=========

const io = SocketIOServer(server, {
    allowRequest: (req, callback) => {
        callback(
            null,
            req.headers.referer.startsWith("http://localhost:3000") ||
                req.headers.referer.startsWith(
                    "https://writersbook-production.up.railway.app/"
                )
        );
    },
});

//======MIDDLEWARE======
app.use(compression());
app.use(express.json()); // to acces the req.body
const cookieSessionMiddleware = cookieSession({
    // secret: secretcookie.cookieSecret,
    secret: "P4Y45OQU3M1R45",
    maxAge: 100 * 60 * 60 * 24 * 14,
    sameSite: true,
});

app.use(cookieSessionMiddleware);

io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(express.static(path.join(__dirname, "..", "client", "public")));
//=====SERVER REQUESTS=====
//REGISTER=================
app.post("/register.json", (req, res) => {
    hash(req.body.password)
        .then((hashedPw) => {
            db.addUser(req.body.first, req.body.last, req.body.email, hashedPw)
                .then((row) => {
                    req.session.userId = row.rows[0].id;
                    res.json({ success: true });
                })
                .catch((err) => {
                    console.log("Error ading User: ", err);
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("Error ading User: ", err);
            res.json({ success: false });
        });
});
//LOGIN=================
app.post("/login.json", (req, res) => {
    const data = req.body;

    db.getUser(data.email)
        .then(({ rows }) => {
            return rows[0];
        })
        .then((results) =>
            compare(data.password, results.password).then((match) => {
                if (match === true) {
                    req.session.userId = results.id;
                    res.json({ success: true });
                } else {
                    res.json({ success: false });
                }
            })
        )
        .catch((err) => {
            console.log("Error login User: ", err);
            res.json({ success: false });
        });
});

//RESET PASSWORD========

app.post("/reset-password/start", (req, res) => {
    const data = req.body;

    db.getUser(data.email)
        .then(({ rows }) => {
            return rows[0];
        })
        .then((results) => {
            if (results.email) {
                db.checkFromReset(results.email)
                    .then(({ rows }) => {
                        return rows[0];
                    })
                    .then((results2) => {
                        if (results2) {
                            const code = cryptoRandomString({
                                length: 6,
                            });
                            db.updateCode(code, results2.email);
                            sendEmail(
                                results2.email,
                                "This is your code",
                                `Please, paste this code in the required input: ${code}`
                            );
                            res.json({ success: true });
                        } else {
                            const code = cryptoRandomString({
                                length: 6,
                            });
                            db.createFirstCode(code, results.email);
                            sendEmail(results.email, "This is your code", code);
                            res.json({ success: true });
                        }
                    });
            }
        })
        .catch((err) => {
            console.log("error sending code", err);
        });
});

app.post("/reset-password/confirm", (req, res) => {
    const data = req.body;
    db.checkCode(data.email).then(({ rows }) => {
        if (data.code === rows[0].code) {
            hash(data.password).then((hashedPw) => {
                db.updatePassword(hashedPw, data.email).then(() => {
                    res.json({ success: true });
                });
            });
        }
    });
});

//LOGOUT================
app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

// UPLOAD===============

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    if (req.file) {
        const url =
            "https://onionimageboard.s3.amazonaws.com/" +
            req.session.userId +
            "/" +
            req.file.filename;
        db.updateImage(url, req.session.userId)
            .then(({ rows }) => {
                res.json({ success: true, img: rows[0].url });
            })
            .catch((e) => {
                console.log("error uploading pic", e);
                res.json({ success: false });
            });
    } else {
        res.json({ success: false });
    }
});

app.post("/update-bio", (req, res) => {
    const data = req.body;
    db.updateBio(data.textarea, req.session.userId).then(({ rows }) => {
        res.json({ success: true, bio: rows[0].bio });
    });
});

//FIND USERS============

app.get("/people/:people?", (req, res) => {
    db.searchPeople(req.params.people)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((e) => {
            console.log("Error in server /people", e);
        });
});

//APP=MOUNT=================

app.get("/appmount", (req, res) => {
    db.getUserById(req.session.userId)
        .then(({ rows }) => {
            res.json(rows[0]);
        })
        .catch((e) => {
            console.log("Error in server /appmount", e);
        });
});

//RENDER OTHER USER=====

app.get(`/api/user/:id`, (req, res) => {
    db.getUserById(req.params.id)
        .then(({ rows }) => {
            res.json(rows[0]);
        })
        .catch((e) => {
            console.log("Error in server /appmount", e);
        });
});

// FRIENDSHIPS==========

app.get("/api/following/:id", (req, res) => {
    const logedInId = req.session.userId;
    const viewedId = req.params.id;
    db.isFriend(logedInId, viewedId)
        .then(({ rows }) => {
            if (rows.length === 0) {
                res.json("Follow");
            } else if (rows[0].accepted) {
                res.json("Unfollow");
            } else if (rows[0].sender_id === logedInId) {
                res.json("Cancel Follow");
            } else if (rows[0].recipient_id === logedInId) {
                res.json("Accept");
            }
        })
        .catch((e) => {
            console.log("Error in /api/following/:id ", e);
        });
});

app.post(`/api/follow-status/:id`, (req, res) => {
    const logedInId = req.session.userId;
    const viewedId = req.params.id;

    if (req.body.buttonText === "Follow") {
        db.follow(logedInId, viewedId)
            .then(res.json("Cancel Follow"))
            .catch((e) => {
                console.log("Error following in the database", e);
            });
    } else if (req.body.buttonText === "Cancel Follow") {
        db.cancelFollow(logedInId, viewedId)
            .then(res.json("Follow"))
            .catch((e) => {
                console.log("Error following in the database", e);
            });
    } else if (req.body.buttonText === "Accept") {
        db.acceptFollow(logedInId, viewedId)
            .then(res.json("Unfollow"))
            .catch((e) => {
                console.log("Error following in the database", e);
            });
    } else if (req.body.buttonText === "Unfollow") {
        db.unfollow(logedInId, viewedId)
            .then(res.json("Follow"))
            .catch((e) => {
                console.log("Error following in the database", e);
            });
    } else if (req.body.buttonText === "Reject") {
        db.rejectFollow(logedInId, viewedId)
            .then(res.json("Follow"))
            .catch((e) => {
                console.log("Error following in the database", e);
            });
    }
});

//FRIENDSANDWANABEES COMPONENT==

app.get(`/follow`, (req, res) => {
    db.checkfollowing(req.session.userId)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((e) => {
            console.log("Error in server /follow", e);
        });
});

//WELCOME===============
app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId,
    });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

//DELETE ACCOUNT
app.post(`/api/delete`, (req, res) => {
    res.json({
        btn: "Just do it!",
        err: "If you do it you will loose all your data. This process is irreversible.",
    });
});

app.post(`/api/delete-yes`, s3.delete, (req, res) => {
    db.deleteMessagesById(req.session.userId)
        .then(() => {
            db.deleteFriendshipsById(req.session.userId);
        })
        .then(() => {
            db.getUserById(req.session.userId).then((data) => {
                db.deleteEmailFromPasswords(data.email);
            });
        })
        .then(() => {
            db.deleteUser(req.session.userId);
        })
        .then(() => {
            req.session = null;
            res.json({ success: true });
        })
        .catch((e) => {
            console.log("Error deleting account", e);
        });
});

// SOCKET.IO AND LISTEN======

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

io.on("connection", (socket) => {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    db.getLastTenMessages()
        .then(({ rows }) => {
            socket.emit("chatMessages", rows);
        })
        .catch((e) => {
            console.log("Error with the messages in socjket.io", e);
        });

    socket.on("newChatMessage", (data) => {
        db.addMessage(socket.request.session.userId, data).then(({ rows }) => {
            const id = rows[0].id;
            const date = rows[0].created_at;
            const message = rows[0].message;

            db.getUserById(socket.request.session.userId).then(({ rows }) => {
                io.emit("chatMessage", {
                    chat_id: id,
                    first: rows[0].first,
                    last: rows[0].last,
                    message: message,
                    time: date,
                    url: rows[0].url,
                    user_id: rows[0].id,
                });
            });
        });
    });

    console.log(
        `User with the ${socket.id} and the userId ${socket.request.session.userId} connected.`
    );
});
