const mongoose = require('mongoose');
const Promise = require('bluebird');
const mongo = require('../config').mongo;

module.exports = function(callback) {
	const uri = `mongodb://${mongo.host}:${mongo.port}/${mongo.name}`;
	const mongoOptions = {
		useUnifiedTopology: true,
		useNewUrlParser: true
	};

	// Use bluebird
	mongoose.Promise = Promise;
	mongoose.connect(uri, mongoOptions);
	const db = mongoose.connection;
	db.on("error", console.error.bind(console, "Connection error:"));
	db.once("open", () => {
		console.log("Mongoose connection is open");
	});

	callback();
};
