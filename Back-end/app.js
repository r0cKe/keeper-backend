require("dotenv").config();
const express = require("express");
const User = require("./Models/User.js");
const connectToMongoDB = require("./db.js");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());

connectToMongoDB();

passport.use(User.createStrategy());

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id, (err, user) => {
		done(err, user);
	});
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

// --------------Deployment --------------

// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === "production") {
// 	app.use(express.static(path.join(__dirname1, "/front-end/build")));

// 	app.get("*", (req, res) => {
// 		res.sendFile(path.resolve(__dirname1, "front-end", "build", "index.html"));
// 	});
// } else {
// 	app.get("/", (req, res) => {
// 		res.send("API is not running successfully");
// 	});
// }

// --------------Deployment --------------

const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
	console.log("Server is running");
});
