// routes.js

function setup(app, handlers) {
	// route middleware
	app.use(function(req,res,next){
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		if (req.method === "OPTIONS") return res.status(200).send();
		next();

		console.log(new Date(),req.method, req.url, req.body);
		// console.log("    RESPONSE ",res.statusCode);
	});

  // user stuff
  app.get('/api/users', handlers.user.getUsers);
  app.post('/api/users', handlers.user.createUser);
  app.post('/api/users/login', handlers.user.login);
  app.get('/api/users/logout', handlers.user.logout);
  app.get('/api/users/:user_id', handlers.user.getUser);

  // Projects
  app.get('/api/projects/:user_id/:project_id', handlers.project.getProject);
  app.get('/api/projects/:user_id', handlers.project.getProjects);
  app.post('/api/projects/:user_id', handlers.project.createProject);
	app.put('/api/projects/:project_id', handlers.project.updateProject);
	app.delete('/api/projects/:project_id', handlers.project.deleteProject);

	// Entries
	app.get('/api/entries/:user_id/:project_id', handlers.entry.getEntriesByProject);
	app.get('/api/entries/:user_id', handlers.entry.getEntriesByUser);
	app.post('/api/entries/', handlers.entry.createEntry);
	app.put('/api/entries/:entry_id', handlers.entry.updateEntry);
	app.delete('/api/entries/:entry_id', handlers.entry.deleteEntry);

	// Tasks
	app.get('/api/tasks/:entry_id/:task_id', handlers.task.getTask);
	app.get('/api/tasks/:entry_id', handlers.task.getTasks);
	app.post('/api/tasks/:entry_id', handlers.task.createTask);
	app.put('/api/tasks/:task_id', handlers.task.updateTask);
	app.delete('/api/tasks/:entry_id/:task_id', handlers.task.deleteTask);

	// Route Error Handling
	app.all('/*', function(req,res,next){
		res.status(404).send("Not Found");
	});
}

exports.setup = setup;
