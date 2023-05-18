const axios = require("axios");
const jwt = require("jsonwebtoken");
const jwtBlacklist = require("express-jwt-blacklist");

async function login(hostApi, authHeader) {
	const url = new URL(hostApi);
	const path = `${url}/user/authentication`;

	const options = {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: authHeader
		}
	};

	return axios.get(path, options)
		.then(({data}) => {
			const user = data.user;
			const expireDate = new Date(data.authToken.expires);
			const expiresIn = expireDate.getTime() - Date.now();
			const token = jwt.sign({sub: user._id, prms: user.admin, exp: expiresIn, girder: data.authToken.token}, process.env.SECRET_KEY || "my-test-secret");
			data.localJWT = token;
			return data;
		})
		.catch((err) => {
			const response = err.response;
			const errorMessage = response && response.data.message ? `with message: ${response.data.message}` : "&lt;none&gt;";
			const error = new Error(
				`Request to ${url} failed\n
				${errorMessage}\n
				Status Code: ${response.status}`
			);
			error.name = "UnauthorizedError";
			throw error;
		});
}

async function logout(host, token, user) {
	const url = new URL(host);
	const path = `${url}/user/authentication`;

	const options = {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"Girder-Token": token
		}
	};

	return axios.delete(path, options)
		.then((res) => {
			jwtBlacklist.revoke(user);
			return res.data;
		})
		.catch((err) => {
			const response = err.response;
			const errorMessage = response && response.data.message ? `with message: ${response.data.message}` : "&lt;none&gt;";
			const error = new Error(
				`Request to ${url} failed\n
				${errorMessage}\n
				Status Code: ${response.status}`
			);
			throw error;
		});
}

module.exports = {
	login,
	logout
};
