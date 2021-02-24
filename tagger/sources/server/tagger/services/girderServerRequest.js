const axios = require("axios");

function get(url, options) {
	return axios.get(url, options)
		.then(res => res.data)
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

function put(url, options, data) {
	return axios.put(url, data || {}, options)
		.then(res => res.data)
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
	get,
	put
};
