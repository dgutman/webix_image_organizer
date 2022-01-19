const {
	MONGODB_NAME,
	MONGODB_HOST,
	MONGODB_PORT
} = process.env;

module.exports = {
	serverPort: 4000,
	db: {
		name: MONGODB_NAME || "taggerdb",
		host: MONGODB_HOST || "localhost",
		port: MONGODB_PORT || 27017
	}
};
