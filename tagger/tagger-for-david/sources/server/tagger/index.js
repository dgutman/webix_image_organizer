const express = require("express");

const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("./etc/jwt");
const errorHandler = require("./etc/errorHandler");
const config = require("./etc/config");
const dotenv = require("dotenv");

// load process env constants
dotenv.load();

require("./db");
require("../../utils/polyfills");
const imagesRoutes = require("./routes/images");
const tagsRoutes = require("./routes/tags");
const valuesRoutes = require("./routes/values");
const confidenceRoutes = require("./routes/confidence");
const notesRoutes = require("./routes/notes");
const authRoutes = require("./routes/auth");
const foldersRoutes = require("./routes/folders");

app.use(bodyParser.urlencoded({limit: "10mb", extended: false}));
app.use(bodyParser.json({limit: "10mb"}));
app.use(cors());
// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use("/api/images", imagesRoutes);
app.use("/api/tags", tagsRoutes);
app.use("/api/values", valuesRoutes);
app.use("/api/confidence", confidenceRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/folders", foldersRoutes);
app.use("/api/auth", authRoutes);

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === "production" ? process.env.PORT || 80 : config.serverPort;
const server = app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
