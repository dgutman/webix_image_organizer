const {
	MONGODB_NAME,
	MONGODB_HOST,
	MONGODB_PORT,
	MONGODB_USER_NAME,
	MONGODB_PWD
} = process.env;

module.exports = {
	serverPort: 4000,
	db: {
		name: MONGODB_NAME || "taggerdb",
		host: MONGODB_HOST || "localhost",
		port: MONGODB_PORT || 27017,
		username: MONGODB_USER_NAME || "",
		pwd: MONGODB_PWD || ""
	}
};
