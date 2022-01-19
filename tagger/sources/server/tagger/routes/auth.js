const express = require("express");

const router = express.Router();
const authService = require("../services/auth");

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
	const user = req.user.sub;
	const host = req.body.host;
	const token = req.headers["girder-token"];

	authService.logout(host, token, user)
		.then(data => res.send(data))
		.catch(err => next(err));
}

// routes
router.get("/", login);
router.delete("/", logout);

module.exports = router;
