const mongoose = require('mongoose');
const Promise = require('bluebird');
const mongo = require('../config').mongo;

module.exports = function(callback) {
    //const uri = `mongodb://${mongo.host}:${mongo.port}/${mongo.name}`;

    const uri = `mongodb://${CONFIG.db.username}:${CONFIG.db.pwd}@${CONFIG.db.host}:${CONFIG.db.port}/${CONFIG.db.name}`
    // Use bluebird
    mongoose.Promise = Promise;
    mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

    callback();
};
