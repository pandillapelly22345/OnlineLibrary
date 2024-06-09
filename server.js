const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const encoder = bodyParser.urlencoded({ extended: true });

const app = express();
app.use("/signin.css", express.static("signin.css"));
app.use("/afterSignIn.css", express.static("afterSignIn.css"));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/signUp.js", express.static("signUp.js"));
app.use("/newCollectionimg", express.static(path.join(__dirname, "newCollectionimg")));
app.use("/style.css", express.static("style.css"))
app.use("/Aboutus.css", express.static("Aboutus.css"))

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "learnify"
});

// Connect to database
connection.connect(function (error) {
    if (error) throw error;
    else console.log("connected to the database successfully!!");
});


app.post("/", encoder, function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    connection.query(
        "SELECT * FROM loginuser WHERE user_email = ? AND user_pass = ?",
        [username, password],
        function (error, results, fields) {
            if (results.length > 0) {
                res.redirect("/afterSignIn");
            } else {
                res.redirect("/");
            }
            res.end();
        }
    );
});

app.post("/signUp", encoder, function (req, res) {
    const { fName, lName, email, number, password } = req.body;

    const insertUserQuery = "INSERT INTO users (first_name, last_name, email, phone_number, passwords) VALUES (?, ?, ?, ?, ?)";
    const insertLoginUserQuery = "INSERT INTO loginuser (user_email, user_pass) VALUES (?, ?)";

    connection.query(insertUserQuery, [fName, lName, email, number, password], function (error, results, fields) {
        if (error) {
            console.error("Error inserting data into users table: ", error);
            res.redirect("/signUp");
        } else {
            connection.query(insertLoginUserQuery, [email, password], function (error, results, fields) {
                if (error) {
                    console.error("Error inserting data into loginuser table: ", error);
                    res.redirect("/signUp");
                } else {
                    console.log("User registered successfully!");
                    res.redirect("/afterSignIn");
                }
                res.end();
            });
        }
    });
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signin.html");
});

app.get("/signUp", function (req, res) {
    res.sendFile(__dirname + "/signUp.html");
});

app.get("/afterSignIn", function (req, res) {
    res.sendFile(__dirname + "/afterSignIn.html");
});

app.get("/Aboutus", function (req, res) {
    res.sendFile(__dirname + "/Aboutus.html");
});

app.get("/newCollections", function(req, res){
    res.sendFile(__dirname + "/newCollections.html")
})

app.get("/aftSInLoc", function(req, res){
    res.sendFile(__dirname + "/aftSInLoc.html")
})

// Set app port
app.listen(4000, function () {
    console.log("Server is running on port 4000");
});
