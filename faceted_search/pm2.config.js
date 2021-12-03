// PM2 config
module.exports = {
	apps: [
		{
			name: "faceted_search",
			script: "./index.js",
			increment_var: "PORT",
			env: {
				PORT: 80,
				NODE_ENV: "development"
			},
			env_production: {
				PORT: 80,
				NODE_ENV: "production"
			}
		}
	]
};
