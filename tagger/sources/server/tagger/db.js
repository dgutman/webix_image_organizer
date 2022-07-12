const mongoose = require("mongoose");
const Joi = require("joi");
const CONFIG = require("./etc/config.js");

const joiSchema = Joi.object({
	username: Joi.string()
		.alphanum()
		.min(2)
		.max(30)
		.required(),
	pwd: Joi.string()
		.pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
});

const result = joiSchema.validate({username: CONFIG.db.username, pwd: CONFIG.db.pwd});
console.log(`mongodb://${CONFIG.db.username}:${CONFIG.db.pwd}@${CONFIG.db.host}:${CONFIG.db.port}/${CONFIG.db.name}`)
if (result.error) {
	mongoose.connect(`mongodb://${CONFIG.db.host}:${CONFIG.db.port}/${CONFIG.db.name}`, {
		useUnifiedTopology: true,
		useNewUrlParser: true
	});
}
else {
	mongoose.connect(`mongodb://${CONFIG.db.username}:${CONFIG.db.pwd}@${CONFIG.db.host}:${CONFIG.db.port}/${CONFIG.db.name}`, {
		useUnifiedTopology: true,
		useNewUrlParser: true
	});
}

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
	console.log("Mongoose connection is open");
});
