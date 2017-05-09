// EntryHandler.js

let Entry = require('../models/entry.js');
let TaskHandler = require('./TaskHandler');
		TaskHandler = new TaskHandler();

let ProjectHandler = require('./ProjectHandler.js');

let EntryHandler = function() {

	// GET all entries by user_id (GET /api/entries/:user_id)
	this.getEntriesByUser = (req, res) => {
		Entry.find({user_id: req.params.user_id}, (err, entries) => {
			if (err) return res.status(500).send();
			if (!entries) return res.status(404).send();
			this.resolveEntryTasks(entries)
				.then( (resolvedEntries) => {
					console.log('resolvedEntries',resolvedEntries);
					return res.status(200).send(resolvedEntries);
				})
				.catch( (err) => {
					return res.status(500).send(err);
				});
		});
	};

	// GET all entries by proj id (GET /api/entries/:user_id/:project_id)
	this.getEntriesByProject = (req, res) => {
		Entry.find({
			user_id: req.params.user_id,
			project_id: req.params.project_id},
			(err, entries) => {
				if (err) return res.status(500).send();
				if (!entries.length) return res.status(404).send();
				this.resolveEntryTasks(entries)
					.then( (resolvedEntries) => {
						return res.status(200).send(resolvedEntries);
					})
					.catch( (err) => {
						return res.status(500).send(err);
					});
			});
	};

	// ADD an entry (POST /api/entries)
	this.createEntry = (req, res) => {
		let en = new Entry();
		en.project_id = req.body.project_id;
		en.user_id = req.body.user_id;
		en.title = req.body.title;
		if (!en.title || !en.user_id || !en.project_id) return res.status(406).send();
		en.save( (err, entry) => {
			if (err) res.status(500).send();
			return res.status(200).send(entry);
		});
	};

	// UPDATE a entry (PUT /api/entries/:entry_id)
	this.updateEntry = (req, res) => {
		req.newData = {};
		req.newData.date_updated = new Date();
		req.newData.title = req.body.title;
		req.newData.entry_text = req.body.entry_text;
		Entry.findOneAndUpdate({_id: req.params.entry_id}, req.newData,
			{upsert:true}, (err, doc)=> {
			if (err) return res.status(500).send({error:err});
			return res.status(200).send(doc);
		});
	};

	// DELETE an entry (DELETE /api/entries/:entry_id)
	this.deleteEntry = (req, res) => {
		Entry.findByIdAndRemove(req.params.entry_id, (err) => {
			if (err) return res.status(500).send();
			TaskHandler.cascadeDelete(req.params.entry_id, (err) => {
				if (err) console.error(err);
				return res.status(200).send();
			});
		});
	};

	/**
	 * Deletes all entries pertaining to a project that has been deleted
	 */
	this.cascadeDelete = (project_id) => {
		return new Promise((resolve, reject) => {
			Entry.find({project_id: project_id}, (err, entries) => {
				if (err) reject(err);
				entries.map( x => {
					Entry.findByIdAndRemove(x._id, (err) => {
						if (err) return res.status(500).send({error:err});
						TaskHandler.cascadeDelete(x._id);
					});
				});
				resolve();
			});
		});
	};

	this.resolveEntryTasks = (entries) => {
		let promises = entries.map( (entry) => {
			return new Promise( (resolve, reject) => {
				this.getEntriesTasks(entry)
					.then( (resolvedTasks) => {
						entry.tasks = resolvedTasks;
						resolve(entry);
				});
			});
		});

		return Promise.all(promises);
	};

	/**
	 * Takes in an Entry object and returns the task objects pertaining to it
	 */
	this.getEntriesTasks = (entry) => {
		let promises = entry.tasks.map( taskId => {
			return new Promise( (resolve, reject) => {
				TaskHandler.getTaskById(taskId)
					.then( (taskObj) => {
						resolve(taskObj);
					})
					.catch( (err) => {
						reject(err);
					});
			});
		});
		return Promise.all(promises)
			// .then( (resolvedTasks) => {
			// 	console.log('resolvedTasks', resolvedTasks);
			// 	return resolvedTasks;
			// })
			// .catch( (err) => {
			// 	console.log(err);
			// });
	};
};

module.exports = EntryHandler;
