// ProjectHandler.js 

let Project = require('../models/project.js');
let EntryHandler = require('./EntryHandler.js');
		EntryHandler = new EntryHandler();
let TaskHandler = require('./TaskHandler');
		TaskHandler = new TaskHandler();

let ProjectHandler = function() {
	
	// GET all projects by a user(GET /api/projects/:user_id)
	this.getProjects = (req, res) => {
		Project.find({user_id: req.params.user_id}, (err, projects) => {
			if (err) return res.status(500).send();
			if (!projects) return res.status(404).send();
			return res.status(200).send(projects);
		});
	};
	
	// GET specific project by a user(GET /api/projects/:user_id/:project_id)
	this.getProject = (req, res) => {
		Project.findOne({
			user_id: req.params.user_id, 
			_id: req.params.project_id}, (err, project) => {
			if (err) return res.status(500).send();
			if (!project) return res.status(404).send(project);
			return res.status(200).send(project);
		});
	};

	// ADD a project (POST /api/projects)
	this.createProject = (req, res) => {
		let pj = new Project();
		pj.title = req.body.title;
		pj.user_id = req.body.user_id;
		if (!pj.title || ! pj.user_id) return res.status(406).send();
		pj.save( (err, project) => {
			if (err) res.status(404).send();
			return res.status(200).send(project);
		});
	};

	// UPDATE a project (PUT /api/projects/:project_id)
	this.updateProject = (req, res) => {
		req.newData = {};
		req.newData.title = req.body.title;
		req.newData.date_updated = new Date();
		Project.findOneAndUpdate({_id: req.params.project_id}, req.newData,
			{upsert:true}, (err, doc) => {
				if (err) return res.status(500).send({error:err});
				return res.status(200).send(doc);
			});
	};

	// DELETE a project (DELETE /api/projects/:project_id)
	this.deleteProject = (req, res) => {
		Project.findByIdAndRemove( req.params.project_id, (err) => {
			if (err) return res.status(404).send({error:err});
			EntryHandler.cascadeDelete(req.params.project_id)
				.then(function(reply){
					return res.status(200).send(reply); })
				.catch(function(err){
					return res.status(404).send({error:err});
				});
		});
	};
};

module.exports = ProjectHandler;
