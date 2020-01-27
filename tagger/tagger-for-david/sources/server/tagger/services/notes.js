const Notes = require("../models/notes");
const mongoose = require("mongoose");

function escapeHtml(unsafe) {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

async function create(text, created, userId) {
	// validation
	if (!userId) throw {name: "UnauthorizedError"};
	const content = escapeHtml(text);

	const newNote = new Notes({content, created, userId});
	return newNote.save();
}

async function getByUser(userId) {
	// validation
	if (!userId) throw {name: "UnauthorizedError"};

	const notes = await Notes.find({userId: {$eq: userId}}).sort({created: -1});
	return notes;
}

async function updateNote(id, text, userId) {
	const note = await Notes.findById(id);

	// validation
	if (!note) throw "Note not found";
	if (!text) throw "Content can't be empty";
	if (note.userId !== userId) throw {name: "UnauthorizedError"};

	const content = escapeHtml(text);

	if (note.content !== content) {
		note.content = content;
	}
	return note.save();
}

async function _delete(id, userId) {
	// validation
	if (!userId) throw {name: "UnauthorizedError"};

	return Notes.findOneAndRemove({_id: mongoose.mongo.ObjectId(id), userId});
}

module.exports = {
	getByUser,
	create,
	updateNote,
	_delete
};
