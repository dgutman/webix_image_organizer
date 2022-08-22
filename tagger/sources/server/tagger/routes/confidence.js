const express = require("express");
const confidence = require("../models/confidence");

const router = express.Router();
const notFoundStatus = 404;
const CONFIDENCE_LEVELS = confidence.getAll();

function getAll(req, res) {
	return CONFIDENCE_LEVELS.length !== 0
		? res.send(CONFIDENCE_LEVELS)
		: res.sendStatus(notFoundStatus);
}

// routes
router.get("", getAll);

module.exports = router;
