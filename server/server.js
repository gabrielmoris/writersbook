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

//======MIDDLEWARE======
app.use(compression());
app.use(express.json()); // to acces the req.body
app.use(
    cookieSession({
        // secret: secretcookie.cookieSecret,
        secret: "aB3ErT5F6&5F",
        maxAge: 100 * 60 * 60 * 24 * 14,
        sameSite: true,
    })
);

app.use(express.static(path.join(__dirname, "..", "client", "public")));
//=====SERVER REQUESTS=====
//REGISTER=================
app.post("/register.json", (req, res) => {
    // console.log("from the server side", req.body);
    hash(req.body.password)
        .then((hashedPw) => {
            db.addUser(req.body.first, req.body.last, req.body.email, hashedPw)
                .then((row) => {
                    // console.log(row)
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
            "https://onionimageboard.s3.amazonaws.com/" + req.file.filename;
        db.updateImage(url, req.session.userId)
            .then(({ rows }) => {
                res.json({ success: true, img: rows[0].url });
                console.log(rows);
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
    // console.log("people I search", req.params.people);
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
            console.log(rows);
            if (rows.length === 0) {
                res.json("Follow");
            } else if (rows[0].accepted) {
                res.json("Unfollow");
            } else if (rows[0].sender_id===logedInId) {
                res.json("Cancel Follow");
            } else if (rows[0].recipient_id===logedInId) {
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

    if(req.body.buttonText==="Follow"){
        db.follow(logedInId,viewedId).then(res.json("Cancel Follow")).catch((e)=>{
            console.log("Error following in the database", e);
        });
    } else if (req.body.buttonText === "Cancel Follow") {
        db.cancelFollow(logedInId, viewedId)
            .then(res.json("Follow"))
            .catch((e) => {
                console.log("Error following in the database", e);
            });
    } else if(req.body.buttonText ==="Accept"){
        db.acceptFollow(logedInId, viewedId)
            .then(res.json("Unfollow"))
            .catch((e) => {
                console.log("Error following in the database", e);
            });
    } else if(req.body.buttonText ==="Unfollow"){
        db.unfollow(logedInId, viewedId)
            .then(res.json("Follow"))
            .catch((e) => {
                console.log("Error following in the database", e);
            });
    }
});

//WELCOME===============
app.get("/user/id.json", function (req, res) {
    //this i turn one once i have the middleware cookie.session
    res.json({
        userId: req.session.userId,
    });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
