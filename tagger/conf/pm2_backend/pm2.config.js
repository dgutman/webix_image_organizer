module.exports = {
	apps: [
		{
			name: "Tagger",
			script: "./server/tagger/index.js",
			watch: true,
			increment_var: "PORT",
			env: {
				PORT: 4000,
				NODE_ENV: "production"
			}
		}
	]
};
