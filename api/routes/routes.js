// routes.js

function setup(app, handlers) {
  // user stuff
  app.get('/api/users', handlers.user.getUsers);
  app.post('/api/users', handlers.user.createUser);
  app.post('/api/users/login', handlers.user.login);
  app.get('/api/users/logout', handlers.user.logout);
  app.get('/api/users/:user_id', handlers.user.getUser);

  // Projects 
  app.get('/api/projects/:user_id/:project_id', handlers.project.getProject);
  app.get('/api/projects/:user_id', handlers.project.getProjects);
  app.post('/api/projects', handlers.project.createProject);
	app.put('/api/projects/:project_id', handlers.project.updateProject);
	app.delete('/api/projects/:project_id', handlers.project.deleteProject);

	// Entries
	app.get('/api/entries/:user_id', handlers.entry.getEntriesByUser);
	app.get('/api/entries/:user_id/:project_id', handlers.entry.getEntriesByProject);
	app.post('/api/entries/', handlers.entry.createEntry);
	app.put('/api/entries/:entry_id', handlers.entry.updateEntry);
	app.delete('/api/entries/:entry_id', handlers.entry.deleteEntry);
	
	// Tasks 
	app.get('/api/tasks/:entry_id', handlers.task.getTasks);
	app.post('/api/tasks/:entry_id', handlers.task.createTask);
	app.put('/api/tasks/:task_id', handlers.task.updateTask);
	app.delete('/api/tasks/:entry_id/:task_id', handlers.task.deleteTask);
}

exports.setup = setup;
