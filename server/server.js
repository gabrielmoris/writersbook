const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db.js");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bcrypt");

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

//=====SERVER REQUESTS=====
app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.post("/register.json", (req, res) => {
    // console.log("from the server side", req.body);
    hash(req.body.password)
        .then((hashedPw) => {
            db.addUser(req.body.first, req.body.last, req.body.email, hashedPw)
                .then((row) => {
                    // console.log(row)
                    req.session.userId = row.rows[0].id;
                    res.json({success:true})
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
