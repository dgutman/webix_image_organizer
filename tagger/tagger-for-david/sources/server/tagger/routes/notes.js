const express = require("express");

const router = express.Router();
const notesService = require("../services/notes");

const notFoundStatus = 404;

function create(req, res, next) {
	const created = req.body.created || new Date();
	const content = req.body.content;
	const userId = req.body.userId;

	notesService.create(content, created, userId)
		.then((data) => {
			return res.json({message: "Note was successfully created", data});
		})
		.catch(err => next(err));
}

function getByUser(req, res, next) {
	const userId = req.params.id;

	notesService.getByUser(userId)
		.then(data => (data ? res.send(data) : res.sendStatus(notFoundStatus)))
		.catch(err => next(err));
}

function updateNote(req, res, next) {
	const id = req.params.id;
	const content = req.body.content;

	notesService.updateNote(id, content)
		.then(data => res.json({message: "Note was successfully updated", data}))
		.catch(err => next(err));
}

function _delete(req, res, next) {
	const id = req.params.id;

	notesService._delete(id)
		.then(() => res.json({message: "Note was successfully deleted"}))
		.catch(err => next(err));
}


// routes
router.get("/:id", getByUser);
router.post("", create);
router.put("/:id", updateNote);
router.delete("/:id", _delete);

module.exports = router;
