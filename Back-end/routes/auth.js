const express = require("express");
const User = require("../Models/User.js");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const router = express.Router();

// ROUTE: 1
//Create a User using: POST "/api/auth/" <createuser>. No login required
let success = false;

router.post(
	"/register",
	[
		body("name", "Enter a valid name").isLength({ min: 3 }),
		body("username", "Enter a valid email").isEmail(),
		body("password", "Password must be 5 characters long").isLength({ min: 5 }),
	],
	(req, res) => {
		const newUser = new User({
			username: req.body.username,
			name: req.body.name,
		});
		User.register(newUser, req.body.password, (err, user) => {
			if (err) {
				console.log(err);
				res.json({ success, err });
			} else {
				passport.authenticate("local")(req, res, () => {
					success = true;
					res.json({ success, userDetails: {userId: req.user.id, userName: req.user.name} });
				});
			}
		});
	}
);

// ROUTE: 2
//Authenticate User using: POST "/api/auth/" <login>. No login required

router.post(
	"/login",
	[
		body("username", "Enter a valid username").isEmail(),
		body("password", "Password cannot be empty").exists(),
	],
	(req, res) => {
		const { username, password } = req.body;

		const user = new User({
			username: username,
			password: password,
		});

		req.login(user, (err) => {
			if (err) {
				res.json({ success });
				console.log(err);
			} else {
				passport.authenticate("local")(req, res, function () {
					success = true;
					res.json({ success, userDetails: {userId: req.user.id, userName: req.user.name} });
				});
			}
		});
	}
);

router.post("/logout", function (req, res) {
	const { userId } = req.body;
	if (userId) {
		req.logout(function (err) {
			if (err) {
				return next(err);
			}
			success = true;
			res.json({ success });
		});
	} else {
		res.json({ success, error: "Login first." });
	}
});

module.exports = router;
