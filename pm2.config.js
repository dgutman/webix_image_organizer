// PM2 config
module.exports = {
	apps: [
		{
			name: "tagger-client",
			script: "serve",
			env: {
				PM2_SERVE_PATH: "/app/dev/codebase/",
				PM2_SERVE_PORT: 80,
				PM2_SERVE_SPA: "true",
				PM2_SERVE_HOMEPAGE: "/index.html"
			},
			env_production: {
				PM2_SERVE_PATH: "/app/dev/codebase/",
				PM2_SERVE_PORT: 80,
				PM2_SERVE_SPA: "true",
				PM2_SERVE_HOMEPAGE: "/index.html"
			}
		}
	]
};
