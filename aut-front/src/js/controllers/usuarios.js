(function(app) {
    app.service('UsuariosServices', function ($resource) {

        var resource = $resource('/eye-tracking-api/usuarios', {}, {
            query: {
                method: 'GET',
                headers: [
                    {'Content-Type':'application/json'}],
                isArray: true
            },
            create: {
                method: 'POST'
            },
            update: {
                method: 'PUT'
            }

        });

        var resource2 = $resource('/eye-tracking-api/usuarios/:id', {}, {

            delete:{
                method: 'DELETE'
            },
        });

        this.getUsuarios = function getUsuarios(){
            return resource.query({}).$promise;
        };
        this.createUsuario = function createUsuario(usuario){
            return resource.create(usuario);
        };
        this.deleteUsuarioById = function deleteUsuarioById(id){
            return resource2.delete({id: id});
        };
        this.updateUsuario = function updateUsuario(usuario){
            return resource.update(usuario);
        }


    });



    app.controller('UsuariosListController', function($scope, $resource, $state, $mdDialog, $rootScope, $mdToast, usuarios, _, UsuariosServices) {

        'use strict';

        $scope.showSimpleToast = function(text) {

            $mdToast.show(
                $mdToast.simple()
                    .textContent(text)
                    .hideDelay(3000)
            );
        };

        $scope.usuarios = usuarios;

        $scope.query = [];

        $scope.search = function (row) {
            var isIt = (angular.lowercase(row.email).indexOf(angular.lowercase($scope.query) || '') !== -1 ||
                angular.lowercase(row.nombre).indexOf(angular.lowercase($scope.query) || '') !== -1 );

            return isIt;
        };

        $scope.goBack = function(){
            $state.go('home');
        }


        $scope.$watch('query', function () {
            if($scope.query.length > 0) {
                $scope.query.toLowerCase();
            }
        });

        $scope.createNew = function (ev) {

            var usuario = {

                fechaCreacion: Date.now()
            }

            $scope.showDetails(ev, usuario);
        };

        $scope.update = function (ev, usuario) {


            $scope.showDetails(ev, usuario, true);
        };

        $scope.showDetails = function (ev, usuario, alreadyExists) {
            $mdDialog.show({
                templateUrl: 'partials/usuarios.dialog.html',
                targetEvent: ev,
                clickOutsideToClose: false,
                controller: 'UsuariosDialog',
                escapeToClose: true,
                locals: {usuario: usuario, alreadyExists: alreadyExists},
                focusOnOpen: true
            }).then(function (usuario) {

                if(usuario.$$alreadyExists){
                    $scope.showSimpleToast("Cambios Guardados");
                    usuario.fechaUltimaModificacion = Date.now();

                    UsuariosServices.updateUsuario(usuario);

                }else{
                    $scope.usuarios.push(usuario);

                    UsuariosServices.createUsuario(usuario);

                    $scope.showSimpleToast("Usuario Creado");
                }


            });

        };

    })

    .controller('UsuariosDialog', function ($scope, $mdDialog, usuario, alreadyExists) {

        $scope.usuario = usuario;
        if(alreadyExists){
            $scope.usuario.$$alreadyExists = alreadyExists;
        }

        $scope.saveUsuario = function saveUsuario() {
            $mdDialog.hide($scope.usuario);
        };

        $scope.closeDialog = function () {
            $mdDialog.cancel();
        };

        $scope.canSave = function(){
            if($scope.usuario.nombreUsuario && $scope.usuario.email){
                return false;
            }
            return true;
        };

    })


})(networkautomation);
