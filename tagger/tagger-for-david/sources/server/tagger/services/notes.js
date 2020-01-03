const Notes = require("../models/notes");

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
	const content = escapeHtml(text);

	const newNote = new Notes({content, created, userId});
	return newNote.save();
}

async function getByUser(userId) {
	const notes = await Notes.find({userId: {$eq: userId}}).sort({created: -1});
	return notes;
}

async function updateNote(id, text) {
	const note = await Notes.findById(id);

	// validation
	if (!note) throw "Note not found";
	if (!text) throw "Content can't be empty";

	const content = escapeHtml(text);

	if (note.content !== content) {
		note.content = content;
	}
	return note.save();
}

async function _delete(id) {
	return Notes.findByIdAndRemove(id);
}

module.exports = {
	getByUser,
	create,
	updateNote,
	_delete
};
