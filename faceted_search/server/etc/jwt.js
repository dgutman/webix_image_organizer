const {expressjwt: expressJwt} = require("express-jwt");

function jwt() {
	const secret = process.env.SECRET_KEY || "my-test-secret";
	return expressJwt({
		secret,
		algorithms: ['HS256'],
		getToken: (req) => req.headers["local-jwt"]
	}).unless({
		path: [
			// public routes that don't require authentication
			{url: "/api/auth", methods: ['GET']},
			{url: /\/api\/images\/[^\>]+/},
			{url: /\/api\/skin\/user\/[a-zA-Z]+/},
			{url: "/"},
			{url: /\/api\/host\/\d+/},
			{url: /\/api\/facets\/images[^\>]*/},
			{url: /\/api\/facets\/filters[^\>]*/}
		]
	});
}

module.exports = jwt;
