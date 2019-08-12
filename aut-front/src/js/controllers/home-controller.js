(function(app) {

	app.controller('HomeController', function($scope, $resource, $state, $rootScope, $mdSidenav, _, usuarios) {

	    $scope.stateName = 'Home';

	    if(!$rootScope.logged & !usuarios){
	        $scope.errorMessage = "Ocurrió un error, contacte al administrador."
        }

        if(!$rootScope.logged){
            $state.go('login');
        }


/*        $rootScope.logged = false;

        if(!$rootScope.logged){
            $state.go('login');
		}else{
            $mdSidenav('left').open();
		}*/
	});

})(networkautomation);
