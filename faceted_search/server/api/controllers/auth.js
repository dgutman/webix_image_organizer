const axios = require("axios");
const jwt = require("jsonwebtoken");
const jwtBlacklist = require("express-jwt-blacklist");
const {resolveGirderHost} = require("../../etc/girderHost");

async function login(hostApi, authHeader) {
	const url = new URL(resolveGirderHost(hostApi));
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
			const girderMessage = response?.data?.message;
			const status = response?.status;
			const detail = girderMessage
				|| (status ? `HTTP ${status}` : null)
				|| err.code
				|| err.message;
			const error = new Error(`Request to ${url} failed: ${detail}`);
			error.name = "UnauthorizedError";
			throw error;
		});
}

async function logout(host, token, user) {
	const url = new URL(resolveGirderHost(host));
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
			const girderMessage = response?.data?.message;
			const status = response?.status;
			const detail = girderMessage
				|| (status ? `HTTP ${status}` : null)
				|| err.code
				|| err.message;
			throw new Error(`Request to ${url} failed: ${detail}`);
		});
}

module.exports = {
	login,
	logout
};
