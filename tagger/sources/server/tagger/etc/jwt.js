const expressJwt = require("express-jwt");
const jwtBlacklist = require("express-jwt-blacklist");
// const userService = require("../services/users");

function jwt() {
	const secret = process.env.SECRET_KEY;
	return expressJwt({
		secret,
		algorithms:['HS256'],
		isRevoked: jwtBlacklist.isRevoked,
		getToken: req => req.headers["tagger-jwt"]
	}).unless({
		path: [
			// public routes that don't require authentication
			{url: "/api/auth", methods: ["GET"]}
		]
	});
}

module.exports = jwt;
