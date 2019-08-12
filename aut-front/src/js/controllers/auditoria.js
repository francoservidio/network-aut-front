(function(app) {


    app.service('AuditoriaServices', function ($resource) {

        var resource = $resource('/eye-tracking-api/auditoria', {}, {
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

        var resource2 = $resource('/eye-tracking-api/auditoria/:id', {}, {

            delete:{
                method: 'DELETE'
            },
        });

        this.getAuditoria = function getAuditoria(){
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

    app.controller('AuditoriaController', function($scope, $resource, $state, $mdDialog, $rootScope, $mdToast, auditoria, AuditoriaServices) {

        'use strict';

        $scope.showSimpleToast = function(text) {

            $mdToast.show(
                $mdToast.simple()
                    .textContent(text)
                    .hideDelay(3000)
            );
        };

        //$scope.auditoria = auditoria;
        $scope.auditoria = auditoria.data;

        $scope.query = [];

        $scope.search = function (row) {
            var isIt = (angular.lowercase(row.nombre).indexOf(angular.lowercase($scope.query) || '') !== -1 );

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
                templateUrl: 'partials/auditoria.dialog.html',
                targetEvent: ev,
                clickOutsideToClose: false,
                controller: 'AuditoriaDialog',
                escapeToClose: true,
                locals: {estudiovigente: estudiovigente, alreadyExists: alreadyExists},
                focusOnOpen: true
            }).then(function (estudiovigente) {

                if(estudiovigente.$$alreadyExists){
                    $scope.showSimpleToast("Cambios Guardados");
                    estudiovigente.fechaUltimaModificacion = Date.now();

                    AuditoriaServices.updateEstudioVigente(estudiovigente);

                }else{
                    $scope.auditoria.push(estudiovigente);

                    AuditoriaServices.createEstudioVigente(estudiovigente);

                    $scope.showSimpleToast("Estudio Creado");
                }


            });

        };

    })

        .controller('AuditoriaDialog', function ($scope, $mdDialog, estudiovigente, alreadyExists) {

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
