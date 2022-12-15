// import mongoose from "mongoose";
const mongoose = require('mongoose');

function connectToMongoDB() {
    mongoose
	.connect(
		process.env.MONGO_URI,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => {
		console.log("Successfully Connected To DB");
	})
	.catch((err) => {
		console.log(err);
		console.log("Not connected");
	});
};

module.exports = connectToMongoDB;