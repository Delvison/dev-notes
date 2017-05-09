// TaskHandler.js

let Task = require('../models/task.js');
let Entry = require('../models/entry.js');

let TaskHandler = function() {

	// GET all tasks pertaining to an entry(GET /api/tasks/:entry_id)
	this.getTasks = (req, res) => {
		let tk = Task.find({entry_id: req.params.entry_id}, (err, tasks) => {
			if (err) return res.status(500).send();
			return res.status(200).send(tasks);
		});
	};

	// GET one task (GET /api/tasks/:entry_id/:task_id)
	this.getTask = (req, res) => {
		let tk = Task.findById(req.params.task_id, (err, task) => {
			if (err) return res.status(500).send();
			if (!task) res.status(404).send();
			return res.status(200).send(task);
		});
	};

	// CREATE TASK (POST /api/tasks/:entry_id)
	this.createTask = (req, res) => {
		let tk = new Task();
		tk.task_text = req.body.task_text;
		tk.entry_id = req.params.entry_id;
		tk.user_id = req.body.user_id;
		if (!tk.task_text || !tk.user_id || !tk.entry_id) return res.status(406).send();
		tk.save( (err, task) => {
			if (err) res.status(500).send();
			if (!task) res.status(404).send();
			// add task to entry
			this.addTaskToEntry(req.params.entry_id, task._id, (err, entry) => {
				if (err) res.status(500).send();
				return res.status(200).send(task);
			});
		});
	};

	// UPDATE a task (PUT /api/tasks/:task_id)
	this.updateTask = (req, res) => {
		req.newData = {};
		req.newData.date_updated = new Date();
		req.newData.task_text = req.body.task_text;
		req.newData.is_complete = req.body.is_complete;
		console.log("newData",req.newData);
		Task.findOneAndUpdate({_id:req.params.task_id}, req.newData,
			{upsert:true}, (err,doc) => {
				if (err) return res.status(500).send({error:err});
				return res.status(200).send(doc);
		});
	};

	// DELETE a task (DELETE /api/tasks/:task_id)
	this.deleteTask = (req, res) => {
		Task.findByIdAndRemove(req.params.task_id, (err) => {
			if (err) return res.status(500).send();
			// TODO: remove task from Entry
			return res.status(200).send();
		});
	};

	/**
	 * delete all tasks pertaining to a deleted entry
	 */
	this.cascadeDelete = (entry_id) => {
		return new Promise((resolve, reject) => {
			Task.find( {entry_id: entry_id}, (err, tasks) => {
				if (err) return reject(err);
				tasks.map( x => {
					Task.findByIdAndRemove( x._id );
				});
				return resolve(tasks);
			});
		});
	};


	/**
	 * adds a task to the entry
	 */
	this.addTaskToEntry = (entry_id, task_id, callback) => {
		Entry.findById(entry_id, (err, entry) => {
			if (!entry) callback("Entry not found");
			entry.tasks.push(task_id);
			entry.save( (err, entry) => {
				if (err) return callback(err);
				return callback(null, entry);
			});
		});
	};

	/**
	 * removes a task from the entry
	 */
	this.removeTaskFromEntry = (entry_id, task_id, callback) => {
		Entry.findById(entry_id, (err, entry) => {
			if (!entry) return callback("Event not found");
			entry.tasks = entry.tasks.filter( x => { return x!==task_id; });
			entry.save( (err, entry) => {
				if (err) return callback(err);
				return callback(null);
			});
		});
	};


	this.getTaskById = (task_id, callback) => {
		return new Promise( (resolve, reject) => {
			Task.findById(task_id, (err, task) => {
				if (err) return reject(err);
				resolve(task);
			});
		});
	};

};

module.exports = TaskHandler;
