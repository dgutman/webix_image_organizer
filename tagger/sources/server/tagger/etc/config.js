const {
	DB_USER,
	DB_PASSWORD,
	DB_HOST,
	DB_PORT,
	DB_NAME
} = process.env;

module.exports = {
	serverPort: 4000,
	db: {
		name: DB_NAME || "taggerdb",
		host: DB_HOST || "localhost",
		port: DB_PORT || 27017,
		username: DB_USER || "",
		pwd: DB_PASSWORD || ""
	}
};
