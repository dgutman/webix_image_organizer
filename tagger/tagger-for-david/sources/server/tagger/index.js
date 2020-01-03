const express = require("express");

const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./etc/errorHandler");
const config = require("./etc/config");
// load process env constants
const dotenv = require("dotenv");

dotenv.load();
require("./db");
require("../../utils/polyfills");
const imagesRoutes = require("./routes/images");
const tagsRoutes = require("./routes/tags");
const valuesRoutes = require("./routes/values");
const confidenceRoutes = require("./routes/confidence");
const notesRoutes = require("./routes/notes");

app.use(bodyParser.urlencoded({limit: "10mb", extended: false}));
app.use(bodyParser.json({limit: "10mb"}));
app.use(cors());

// api routes
app.use("/api/images", imagesRoutes);
app.use("/api/tags", tagsRoutes);
app.use("/api/values", valuesRoutes);
app.use("/api/confidence", confidenceRoutes);
app.use("/api/notes", notesRoutes);

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === "production" ? process.env.PORT || 80 : config.serverPort;
const server = app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
