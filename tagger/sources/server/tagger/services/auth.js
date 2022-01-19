const http = require("http");
const jwt = require("jsonwebtoken");
const jwtBlacklist = require("express-jwt-blacklist");

const successStatusCode = 200;

async function login(hostApi, authHeader) {
	const url = new URL(hostApi);
	const path = `${url.pathname}/user/authentication`;

	const options = {
		hostname: url.hostname,
		path,
		port: url.port,
		method: "GET",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: authHeader
		}
	};

	return new Promise((resolve, reject) => {
		const request = http.request(options, (response) => {
			let body = "";
			const {statusCode} = response;

			// A chunk of data has been recieved.
			response.on("data", (data) => {
				body += data;
			});
			// The whole response has been received. Print out the result.
			response.on("end", async () => {
				// parse user info
				body = JSON.parse(body);

				if (statusCode !== successStatusCode) {
					const error = {name: "UnauthorizedError", message: body.message} || `Request Failed.\n Status Code: ${statusCode}`;
					return reject(error);
				}

				const user = body.user;
				const expireDate = new Date(body.authToken.expires);
				const expiresIn = expireDate.getTime() - Date.now();
				const token = jwt.sign({sub: user._id, prms: user.admin, exp: expiresIn}, process.env.SECRET_KEY);
				body.taggerJWT = token;

				resolve(body);
			});
		});

		request.on("error", (err) => {
			reject(err);
		});

		request.end();
	});
}

async function logout(host, token, user) {
	const url = new URL(host);
	const path = `${url.pathname}/user/authentication`;

	const options = {
		hostname: url.hostname,
		path,
		port: url.port,
		method: "DELETE",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"Girder-Token": token
		}
	};

	return new Promise((resolve, reject) => {
		const request = http.request(options, (response) => {
			let body = "";
			const {statusCode} = response;
			if (statusCode !== successStatusCode) {
				const errorMessage = body && body.message ? `with message: ${body.message}` : "&lt;none&gt;";
				const error = new Error(
					`Request to ${url} failed\n
					${errorMessage}\n
					Status Code: ${statusCode}`
				);
				return reject(error);
			}

			// A chunk of data has been recieved.
			response.on("data", (data) => {
				body += data;
			});

			// The whole response has been received. Print out the result.
			response.on("end", () => {
				jwtBlacklist.revoke(user);
				resolve(body);
			});
		});

		request.on("error", (err) => {
			reject(err);
		});

		request.end();
	});
}

module.exports = {
	login,
	logout
};
