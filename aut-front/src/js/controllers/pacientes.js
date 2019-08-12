(function(app) {

    app.service('PacientesServices', function ($resource) {

        var resource = $resource('/eye-tracking-api/pacientes', {}, {
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
            },
        });

        var resource2 = $resource('/eye-tracking-api/pacientes/:id', {}, {

            get:{
                method: 'GET'
            }
        });

        this.getPacientes = function getPacientes(){
            return resource.query({}).$promise;
        };

        this.updatePaciente = function updatePaciente(paciente){
            return resource.update(paciente);
        }
        this.getPacienteById = function getPacienteById(id){
            return resource2.get({id: id}).$promise;
        }

    })

	app.controller('PacientesListController', function($scope,$resource, $mdToast, $state, $timeout, $rootScope, pacientes, $mdDialog) {

	    $scope.pacientes = pacientes;

        $scope.query = [];

        $scope.search = function (row) {
            var isIt = (angular.lowercase(row.datosCliente.dni).indexOf(angular.lowercase($scope.query) || '') !== -1 ||
                angular.lowercase(row.datosCliente.nombre).indexOf(angular.lowercase($scope.query) || '') !== -1 ||
                angular.lowercase(row.datosCliente.apellido).indexOf(angular.lowercase($scope.query) || '') !== -1);

            return isIt;
        };

        $scope.goTo = function goTo(pacienteId) {
            $state.go('pacientes.record', {subId: pacienteId}, {reload:true});
        };

        $scope.$watch('query', function () {
            if($scope.query.length > 0) {
                $scope.query.toLowerCase();
            }
        });

    });

    app.controller('PacientesRecordController', function($scope, $rootScope, $resource, $mdToast, $stateParams, _, $state, paciente, PacientesServices, $mdDialog, dispositivos) {

        $scope.dispositivos = dispositivos;

        $scope.goBack = function(){
            $state.go('pacientes.list');
        }

        $scope.paciente = paciente;

        $scope.pacienteOriginal = angular.copy($scope.paciente);

        $scope.$watch('paciente', function(newValue){
            if (!angular.equals(newValue, $scope.pacienteOriginal)){
                $scope.allowedToSave = true;
            }else{
                $scope.allowedToSave = false;
            }
        }, true);

        $scope.$watch('pacienteOriginal', function(newValue){
            if (!angular.equals(newValue, $scope.paciente)){
                $scope.allowedToSave = true;
            }else{
                $scope.allowedToSave = false;
            }
        }, true);

        $scope.showSimpleToast = function(text) {

            $mdToast.show(
                $mdToast.simple()
                    .textContent(text)
                    .hideDelay(3000)
            );
        };

        $scope.updatePaciente = function (){

            PacientesServices.updatePaciente($scope.paciente);

            $scope.showSimpleToast("Cambios guardados!");

            $scope.pacienteOriginal = null;
            $scope.pacienteOriginal = angular.copy($scope.paciente);
        }

        $scope.createNewEvolucion = function (ev, evolucion, viewonly) {

            if(viewonly == false){
                var evolucion = {

                }
            }

            $scope.showEvolucionDetails(ev, evolucion, viewonly);
        };

        $scope.showEvolucionDetails = function (ev, evolucion, viewonly) {
            $mdDialog.show({
                templateUrl: 'partials/evoluciones.dialog.html',
                targetEvent: ev,
                clickOutsideToClose: false,
                controller: 'EvolucionesDialog',
                escapeToClose: true,
                locals: {evolucion: evolucion, viewonly: viewonly},
                focusOnOpen: true
            }).then(function (evolucion) {

                evolucion.fechaCreacion = Date.now();
                evolucion.hicId = $scope.paciente.historiaClinica.id;

                $scope.paciente.historiaClinica.evoluciones.push(evolucion);

                //PacientesServices.updatePaciente($scope.paciente);

                $scope.showSimpleToast("Evolucion Creada");

            });

        };

        $scope.createNewEstudio = function (ev, estudio, viewonly) {

            if(viewonly == false){
                var estudio = {

                }
            }
            $scope.showEstudioDetails(ev, estudio, viewonly);
        };

        $scope.showEstudioDetails = function (ev, estudio, viewonly) {
            $mdDialog.show({
                templateUrl: 'partials/estudios.dialog.html',
                targetEvent: ev,
                clickOutsideToClose: false,
                controller: 'EstudiosDialog',
                escapeToClose: true,
                locals: {estudio: estudio, viewonly: viewonly, dispositivos: $scope.dispositivos},
                focusOnOpen: true
            }).then(function (estudio) {

                estudio.fechaEstudio = Date.now();
                estudio.hicId = $scope.paciente.historiaClinica.id;

                $scope.paciente.historiaClinica.estudios.push(estudio);

                //PacientesServices.updatePaciente($scope.paciente);

                $scope.showSimpleToast("Estudio Añadido");

            });

        };


    })

    .controller('EvolucionesDialog', function ($scope, $mdDialog, evolucion, viewonly) {

        $scope.viewonly = viewonly;
        $scope.evolucion = evolucion;

        $scope.saveEvolucion = function saveEvolucion() {
            $mdDialog.hide($scope.evolucion);
        };

        $scope.closeDialog = function () {
            $mdDialog.cancel();
        };

        $scope.canSave = function(){
            if($scope.evolucion.detalle){
                return false;
            }
            return true;
        };


    })


    .controller('EstudiosDialog', function ($scope, $mdDialog, estudio, viewonly, dispositivos) {

        $scope.dispositivos = dispositivos;
        $scope.viewonly = viewonly;
        $scope.estudio = estudio;

        function querySearch (query) {
            var queriedEstudios = $scope.dispositivos.filter( createFilterFor(query) );
            return query ?  queriedEstudios : $scope.dispositivos;
        }

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(estudiovigente) {
                var indexOf = estudiovigente.nombreDeEstudio.indexOf(lowercaseQuery);
                return indexOf !== -1;
            };
        }

        $scope.estudioVigenteSearch = null;

        $scope.selectedEstudioVigenteChange = function (estudioVigente){
            if(estudioVigente){
                $scope.estudio.tipoDeEstudio = estudioVigente.nombreDeEstudio;
                $scope.estudio.costo = estudioVigente.precio;
            }
        };

        $scope.canSave = function(){
            if($scope.estudio.costo && $scope.estudio.resultados && $scope.estudio.tipoDeEstudio){
                return false;
            }
            return true;
        };


        $scope.querySearch = querySearch;

        $scope.saveEstudio = function saveEstudio() {
            $mdDialog.hide($scope.estudio);
        };

        $scope.closeDialog = function () {
            $mdDialog.cancel();
        };

    });


})(networkautomation);
