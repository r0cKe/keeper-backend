const express = require("express");
const Note = require("../Models/Note.js");
const router = express.Router();
const { body, validationResult } = require("express-validator");

// ROUTE: 1
// Render notes related to the logged in user <mynotes> logged in required
let success = false;

router.post("/fetchallnotes", (req, res) => {
	const { userId } = req.body;
	if (userId) {
		Note.find({ user: userId }, (err, foundNotes) => {
			if (err) {
				console.log(err);
				res.json({ success });
			} else {
				success = true;
				res.json({ foundNotes, success });
			}
		});
	} else {
		res.json({ success });
	}
});

router.post(
	"/addnote",
	[
		body("title", "Enter a note title").exists(),
		body("content", "Enter your note content").exists(),
	],
	(req, res) => {
		const { userId } = req.body;
		if (userId) {
			const { title, content } = req.body;
			if (title === "" || content === "") {
				success = false;
				return res.json({ success, error: "Note cannot be empty" });
			}
			const note = new Note({
				user: userId,
				title,
				content,
			});
			note.save().then(() => {
				success = true;
				res.json({ success });
			});
		} else {
			res.json({ success, error: "Not Authenticated" });
		}
	}
);

router.put("/editnote/:id", async (req, res) => {
	const { userId, title, content } = req.body;
	if (userId) {
		if (title === "" || content === "") {
			success = false;
			return res.json({ success, error: "Fields cannot be empty." });
		}
		let note = await Note.findById(req.params.id);
		if (!note) {
			return res.status(404).json({ success, error: "Note not found" });
		}
		if (note.user.toString() !== userId) {
			return res.status(401).json({ success, error: "Bad request" });
		}
		note = await Note.findByIdAndUpdate(req.params.id, { title, content });
		success = true;
		res.json({ success, note });
	} else {
		res.json({ success });
	}
});

router.delete("/deletenote/:id", async (req, res) => {
	const { userId } = req.body;
	if (userId) {
		let note = await Note.findById(req.params.id);
		if (!note) {
			return res.status(404).json({ success, error: "Not found" });
		}
		if (note.user.toString() !== userId) {
			return res.status(401).json({ success, error: "Bad request" });
		}
		note = await Note.findByIdAndDelete(req.params.id);
		success = true;
		res.json({ success, note });
	} else {
		res.json({ success });
	}
});

module.exports = router;
