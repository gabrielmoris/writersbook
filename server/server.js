const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db.js");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bcrypt");
const { sendEmail } = require("./ses.js");
const cryptoRandomString = require("crypto-random-string");

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
    // console.log("req.body is:",data)
    db.getUser(data.email).then(({ rows }) => {
        // console.log("result from database",rows)
        return rows[0];
    }).then((results) =>{
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
                        sendEmail(results2.email,"This is your code",code);
                        res.json({ success: true });
                    } else {
                        const code = cryptoRandomString({
                            length: 6,
                        });;
                        db.createFirstCode(code, results.email);
                        sendEmail(results.email, "This is your code", code);
                        res.json({ success: true });
                    }
                });
        } 
    }).catch((err)=>{console.log("error sending code",err)})
});

app.post("/reset-password/confirm", (req, res) => {
    //    en server     POST "/reset-password/confirm"
    // expect the email address, the recovery code, and the new password
    // Check a corresponding valid code is available.
    // Hash the new password, update the users table with the new hash, and send a response indicating success.
});

//LOGOUT================
app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
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
