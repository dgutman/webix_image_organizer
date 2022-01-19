const express = require("express");
// const jwt = require('express-jwt');
// const jwt = require("../../etc/jwt");

const router = express.Router();
const authService = require("../controllers/auth");

function login(req, res, next) {
	const hostApi = req.query.redirect_url;
	const authHeader = req.headers.authorization;

	authService.login(hostApi, authHeader)
		.then((data) => {
			res.json(data);
		})
		.catch(err => next(err));
}

function logout(req, res, next) {
	const user = req.user;
	const host = req.body.host;
	const token = req.headers["girder-token"];

	authService.logout(host, token, user)
		.then(data => res.send(data))
		.catch(err => next(err));
}

module.exports = (app) => {
	router.get("/", login);
	router.delete("/", logout);
    app.use('/auth', router);
};
