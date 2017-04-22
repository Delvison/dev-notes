const testConfig = require('./config/config.json');
const userLogin = require('./data/login.json');
const userCreate = require('./data/sample_user.json');

const chakram = require('chakram'),
			expect = chakram.expect;

let username = Math.random().toString(36).substring(7);
let email = username + "@gmail.com";

describe("API TEST SUITE", function() {
	let user_id = "";
	let project_id = "";
	let entry_id = "";
	let task_id = "";

	beforeEach(function(done){
		setTimeout(function(){
			done()
		}, 5)
	})

	it("should successfully create a user", function(){
		return chakram.post(testConfig.APP_URL+testConfig.USER_API, {
			"email": email,
			"password": "Pa$$w0rd1",
			"username": username
		})
		.then(function(res) {
			user_id = res.body._id;
			expect(res).to.have.status(200);
		});
	});

	it("should successfully create a project", function(){
		return chakram.post(testConfig.APP_URL+testConfig.PROJECT_API, {
			"user_id": user_id,
			"title": user_id+' project'
		}) 
		.then((res) => {
			project_id = res.body._id;
			expect(res).to.have.status(200);
		});
	});

	it("should successfully create an entry", function(){
		return chakram.post(testConfig.APP_URL+testConfig.ENTRY_API, {
			"user_id": user_id,
			"project_id": project_id,
			"title": "THIS IS A TEST ENTRY"
		})
		.then((res) => {
			entry_id = res.body._id;
			expect(res).to.have.status(200);
		});
	});

	it("should successfully create a task", function(){
		return chakram.post(testConfig.APP_URL+testConfig.TASK_API+"/"+entry_id, {
			"user_id": user_id,
			"task_text": "THIS IS A TEST TASK"
		})
		.then((res) => {
			entry_id = res.body._id;
			expect(res).to.have.status(200);
		});
	});

	it("should get a given user", function(){
		return chakram.get(testConfig.APP_URL+testConfig.USER_API+"/"+user_id)
		.then((res) => {
			expect(res).to.have.status(200);
			return chakram.wait();
		});
	});

	it("should get a given project", function(){
		return chakram.get(testConfig.APP_URL+testConfig.PROJECT_API+"/"+user_id+"/"+project_id)
		.then(
			(res) => {
			expect(res).to.have.status(200);
		});
	});

	it("should get all entries by a user", function(){
		return chakram.get(testConfig.APP_URL+testConfig.ENTRY_API+"/"+user_id)
		.then((res) => {
			expect(res).to.have.status(200);
		});
	});

	it("should get all entries belonging to a given project", function(){
		return chakram.get(testConfig.APP_URL+testConfig.ENTRY_API+"/"+user_id+"/"+project_id)
		.then((res) => {
			expect(res).to.have.status(200);
		});
	});

	it("should get all tasks belonging to an entry", function(){
		return chakram.get(testConfig.APP_URL+testConfig.TASK_API+"/"+entry_id)
		.then((res) => {
			expect(res).to.have.status(200);
		});
	});

	it("should update a project", function(){
		return chakram.put(testConfig.APP_URL+testConfig.PROJECT_API+"/"+project_id,
			{"title":"TEST PROJECT CHANGED" })
			.then((res) => {
			expect(res).to.have.status(200);
		});
	});

	it("should update a entry", function(){
		return chakram.put(testConfig.APP_URL+testConfig.ENTRY_API+"/"+entry_id,
			{ "title":"TEST ENTRY CHANGED",
			  "entry_text": "testing adding in entry text" 
			})
			.then((res) => {
			expect(res).to.have.status(200);
		});
	});

	it("should update a task", function(){
		return chakram.put(testConfig.APP_URL+testConfig.TASK_API+"/"+entry_id+"/"+task_id,
			{ "task_text": "TEST TASK CHANGED" })
			.then((res) => {
			expect(res).to.have.status(200);
		});
	});

	it("should delete a project", function(){
		return chakram.delete(testConfig.APP_URL+testConfig.PROJECT_API+"/"+project_id)
			.then((res) => {
			expect(res).to.have.status(200);
		});
	});

	it("should fail to get a given deleted project", function(){
		return chakram.get(testConfig.APP_URL+testConfig.PROJECT_API+"/"+user_id+"/"+project_id)
			.then((res) => {
			expect(res).to.have.status(404);
		});
	});

	it("should fail to get a given deleted entry", function(){
		return chakram.get(testConfig.APP_URL+testConfig.ENTRY_API+"/"+user_id)
			.then((res) => {
			// expect(res).to.have.status(404);
			expect(res.body).length(0);
		});
	});

	it("should fail to get a given deleted task", function(){
		return chakram.get(testConfig.APP_URL+testConfig.TASK_API+"/"+entry_id)
			.then((res) => {
			expect(res.body).length(0);
		});
	});
});

