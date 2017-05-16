
app.controller('dashboardController', ['$scope','$rootScope','$http',
function($scope, $rootScope, $http){
	let baseUrl = "http://localhost:3000/api";
  $scope.projects = [];
  $scope.selected_project_id = "";
  $scope.entries = [];
  $scope.tasks = [];

  // create a project
  $scope.createProject = function() {
    $http
      .post(baseUrl+'/projects/'+$rootScope.auth.getId(), {'title':$scope.newProject})
      .then( (res) => {
        $scope.projects.push(res.data);
      })
      .catch( (err) => {
        console.log('createproj err', err);
      });
  };

  // create an entry
  $scope.createEntry = function() {
    $http
      .post(baseUrl+'/entries/',
      {
        "project_id": $scope.selected_project_id,
        "user_id": $rootScope.auth.getId(),
        "title": $scope.newEntryTitle
      })
      .then( (res) => {
        console.log(res);
      })
      .catch( (err) => {
        console.log(err);
      });
    $scope.getEntries($scope.selected_project_id);
  };

  // create a task for the pertaining entry
  $scope.createTask = function(entryId) {
    console.log($scope.newTask);
    $http
      .post(baseUrl+'/tasks/'+entryId,
      {
        "task_text": $scope.newTask,
        "user_id": $rootScope.auth.getId()
      })
      .then( (res) => {
        console.log(res.body);
        // TODO: add task to entry's tasks array
        $scope.$apply();
      })
      .catch( (err) => {
        // TODO: display error
        console.log(err);
      });
  };

  // get entries pertaining to a project
  $scope.getEntries = function(projectId){
    $scope.selected_project_id = projectId;
    $http
      .get(baseUrl+'/entries/'+$rootScope.auth.getId()+'/'+projectId)
      .then( (res) => {
      	console.log(res);
      	$scope.selected_project_id = projectId;
        $scope.entries = res.data;
        $scope.entries
          .map( x => x.date = x.date_updated || x.date_created);
        $scope.$apply();
      })
      .catch((err) => {
  			console.log(err);
        $scope.entries = [];
  		});
  };

	// update a task
  $scope.updateTask = function(task) {
    $http
      .put(baseUrl+'/tasks/'+task._id,
        {
          "task_text": task.task_text,
          "is_complete": task.is_complete
        }
      )
      .then( (res) => {
        console.log(res);
      });
  };

  // remove an entry
  $scope.removeEntry = function(entryId) {
    $http
			.delete(baseUrl+"/entries/"+entryId)
			.then( (res) => {
				console.log(res);
				$scope.$apply();
				// TODO: remove entry from the entries array
			})
			.catch( (err) => {
				console.log(err);
			});
  };

  // Get all of the projects pertaining to the user
  $http
    .get(baseUrl+'/projects/'+$rootScope.auth.getId())
    .then( (res) => {
      $scope.projects = res.data;
    });
}]);
