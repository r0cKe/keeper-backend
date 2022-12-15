// import mongoose from "mongoose";
const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	title: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
});
const Note = mongoose.model("Note", noteSchema);
Note.createIndexes();

module.exports = Note;
