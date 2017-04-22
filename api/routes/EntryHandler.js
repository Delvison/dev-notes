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
			return res.status(200).send(entries);
		});
	};
	
	// GET all entries by proj id (GET /api/entries/:user_id/:project_id)
	this.getEntriesByProject = (req, res) => {
		Entry.find({
			user_id: req.params.user_id, 
			project_id: req.params.project_id}, 
			(err, entries) => {
				if (err) return res.status(500).send();
				if (entries.length === 0) return res.status(404).send();
				return res.status(200).send(entries);
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
			if (err) res.status(404).send();
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
		Entry.remove({ _id: req.params.entry_id }, (err) => {
			if (err) return res.status(404).send();
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

};

module.exports = EntryHandler;
