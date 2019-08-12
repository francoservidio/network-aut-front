(function(app) {

    app.controller('LoginController', function($scope, $resource, $rootScope, _, $state, $mdToast, UsuariosServices, usuarios) {

        $scope.usuarios = usuarios;

        $scope.showSimpleToast = function(text) {

            $mdToast.show(
                $mdToast.simple()
                    .textContent(text)
                    .hideDelay(3000)
            );
        };

        $scope.verify = function(allowedLogins){

/*            var userFound = _.findWhere(allowedLogins, { email: $scope.email});
            if(userFound){
                $rootScope.logged = true;
                $rootScope.userLogged = userFound;
                $scope.showSimpleToast('Log in existoso');
                if(userFound.esAdministrativo){
                    $state.go('turnos.list');
                }else if(userFound.esOftalmologo){
                    $state.go('pacientes.list');
                }else if(userFound.esAdministrador){
                    $state.go('usuarios.list');
                }
            }else{
                $scope.showSimpleToast('Acceso Denegado');
            }*/

            $rootScope.logged = true;
            $rootScope.userLogged = true;
            $scope.showSimpleToast('Log in existoso');
            $state.go('dispositivos.list');
        }

    });

})(networkautomation);
