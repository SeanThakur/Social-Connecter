const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");

//mongoDB connection

const db = require("./config/config").mongoUri;

mongoose.connect(db,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Mongodb Database connected");
}).catch((error) => {
    console.log(error)
});

//Server app connection

const app = express();

//bodyParser

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//Authentication passport module initialization middleware

app.use(passport.initialize());
//config file for passport stratagy for jwt token
require("./config/passport")(passport);

//Routing Links

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

app.use("/users", users);
app.use("/profile", profile);
app.use("/posts", posts);

//listening Port
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`nodejs started at port ${port}`);
});