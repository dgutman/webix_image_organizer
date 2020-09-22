const mongoose = require('mongoose');
const Promise = require('bluebird');
const mongo = require('../config').mongo;

module.exports = function(callback) {
    const uri = mongo;

    // Use bluebird
    mongoose.Promise = Promise;
    mongoose.connect(process.env.MONGODB_URI || uri);

    callback();
};
