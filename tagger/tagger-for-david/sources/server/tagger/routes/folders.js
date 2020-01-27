const express = require("express");

const router = express.Router();
const foldersService = require("../services/folders");

const notFoundStatuts = 404;

function getResourceFolders(req, res, next) {
	const collectionId = req.body.collectionId;
	const hostApi = req.body.hostApi;
	const token = req.headers["girder-token"];

	foldersService.getResourceFolders(collectionId, hostApi, token)
		.then((data) => {
			if (data) res.json(data);
			else res.sendStatus(notFoundStatuts);
		})
		.catch(err => next(err));
}

// routes
router.post("/resource", getResourceFolders);

module.exports = router;
