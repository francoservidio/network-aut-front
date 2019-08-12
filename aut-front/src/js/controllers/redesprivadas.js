(function(app) {


    app.service('RedesPrivadasServices', function ($resource) {

        var resource = $resource('/eye-tracking-api/redesprivadas', {}, {
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

        var resource2 = $resource('/eye-tracking-api/redesprivadas/:id', {}, {

            delete:{
                method: 'DELETE'
            },
        });

        this.getRedesPrivadas = function getRedesPrivadas(){
            return resource.query({}).$promise;
        };
        this.createEstudioVigente = function createEstudiosVigente(estudiovigente){
            return resource.create(estudiovigente);
        };
        this.deleteEstudioVigenteById = function deleteEstudioVigenteById(id){
            return resource2.delete({id: id});
        };
        this.updateEstudioVigente = function updateEstudioVigente(estudiovigente){
            return resource.update(estudiovigente);
        }

    });

    app.controller('RedesPrivadasController', function($scope, $resource, $state, $mdDialog, $rootScope, $mdToast, redesprivadas, RedesPrivadasServices) {

        'use strict';

        $scope.showSimpleToast = function(text) {

            $mdToast.show(
                $mdToast.simple()
                    .textContent(text)
                    .hideDelay(3000)
            );
        };

        //$scope.redesprivadas = redesprivadas;
        $scope.redesprivadas = redesprivadas.data;

        $scope.query = [];

        $scope.search = function (row) {
            var isIt = (angular.lowercase(row.nombreVlan).indexOf(angular.lowercase($scope.query) || '') !== -1 );

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

            var estudiovigente = {

                fechaCreacion: Date.now()
            }

            $scope.showDetails(ev, estudiovigente);
        };

        $scope.update = function (ev, estudiovigente) {


            $scope.showDetails(ev, estudiovigente, true);
        };

        $scope.showDetails = function (ev, estudiovigente, alreadyExists) {
            $mdDialog.show({
                templateUrl: 'partials/redesprivadas.dialog.html',
                targetEvent: ev,
                clickOutsideToClose: false,
                controller: 'RedesPrivadasDialog',
                escapeToClose: true,
                locals: {estudiovigente: estudiovigente, alreadyExists: alreadyExists},
                focusOnOpen: true
            }).then(function (estudiovigente) {

                if(estudiovigente.$$alreadyExists){
                    $scope.showSimpleToast("Cambios Guardados");
                    estudiovigente.fechaUltimaModificacion = Date.now();

                    RedesPrivadasServices.updateEstudioVigente(estudiovigente);

                }else{
                    $scope.redesprivadas.push(estudiovigente);

                    RedesPrivadasServices.createEstudioVigente(estudiovigente);

                    $scope.showSimpleToast("Estudio Creado");
                }


            });

        };

    })

        .controller('RedesPrivadasDialog', function ($scope, $mdDialog, estudiovigente, alreadyExists) {

            $scope.estudiovigente = estudiovigente;
            if(alreadyExists){
                $scope.estudiovigente.$$alreadyExists = alreadyExists;
            }

            $scope.saveEstudio = function saveEstudio() {
                $mdDialog.hide($scope.estudiovigente);
            };

            $scope.closeDialog = function () {
                $mdDialog.cancel();
            };

            estudiovigente.nombreDeEstudio

            $scope.canSave = function(){
                if($scope.estudiovigente.nombreDeEstudio && $scope.estudiovigente.precio && $scope.estudiovigente.descripcion){
                    return false;
                }
                return true;
            };

        })
})(networkautomation);
