const mongoose = require("mongoose");
const CONFIG = require("./etc/config.json");

mongoose.connect(`mongodb://${CONFIG.db.host}:${CONFIG.db.port}/${CONFIG.db.name}`, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => { console.log("Mongoose connection is open"); });
