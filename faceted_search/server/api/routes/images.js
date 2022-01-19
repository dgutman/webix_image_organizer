const express = require('express');
const path = require('path');
const folder = require('../../../config').images_folder;
const fs = require('fs');

const router = express.Router();

module.exports = (app) => {
	router.get('/:name(*)', function(req, res) {
		const name = req.params.name;
		const pathFile = path.join(folder, name);
		if (name && fs.existsSync(pathFile)) {
            res.sendFile(path.join(folder, name));
		} else res.sendStatus(500);
    });

	app.use('/images', router);
};
