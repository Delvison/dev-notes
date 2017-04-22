// ./models/task.js 

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
	date_created: {
      type: Date,
      default: Date.now
  },
	date_updated: Date,
  user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	entry_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Entry',
		required: true
	},
	is_complete: {
		type: Boolean,
		default: false,
	},
	task_text: {
		type: String,
		default: ""
	}
});

module.exports = mongoose.model('Task', TaskSchema);
