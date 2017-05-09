// ./models/entry.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EntrySchema = new Schema({
	project_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project',
		required: true,
	},
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	title: {
		type: String,
		required: false,
		default: Date.now.toString()
	},
	date_created: {
      type: Date,
      default: Date.now
	},
	date_updated: Date,
	entry_text: {
		type: String,
		default: ""
	},
	tasks: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Task',
	}] // references to tasks
});

module.exports = mongoose.model('Entry', EntrySchema);
