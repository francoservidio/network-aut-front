(function(app) {

    app.service('TurnosServices', function ($resource) {

        var resource = $resource('/eye-tracking-api/turnos', {}, {
            query: {
                method: 'GET',
                headers: [
                    {'Content-Type':'application/json'}],
                isArray: true
            },
            create: {
                method: 'POST'
            }
        });

        var resource2 = $resource('/eye-tracking-api/turnos/:id', {}, {
            delete:{
                method: 'DELETE'
            }
        });

        this.getTurnos = function getTurnos(fechaTurno){
            return resource.query({fechaTurno : fechaTurno}).$promise;
        };
        this.createTurno= function createTurno(turno){
            return resource.create(turno);
        };
        this.deleteTurno = function deleteTurno(id){
            return resource2.delete({id: id});
        };

    });

    app.controller('TurnosListController', function($scope, $mdDialog, TurnosServices, turnos, _, $mdToast, keyvalues, $state) {


        $scope.tiposDeTurno = _.where(keyvalues, {groupName: 'TIPOS_DE_TURNO'});

        var orderTurnosPorHorarios = function(turnos){
            return _.sortBy(turnos, function (turno) {
                if(typeof turno.horario == "object"){
                    return turno.horario.getTime();
                }
                if(typeof turno.horario == "string"){
                    return new Date(turno.horario).getTime();
                }
            })
        }

        $scope.reloadTurnos = function(){
            TurnosServices.getTurnos($scope.turnoDate.getTime()).then(function (response) {
                $scope.turnos = orderTurnosPorHorarios(response);
            })
        };

        $scope.turnos = orderTurnosPorHorarios(turnos);

        $scope.onlyWeekdays = function(date) {
            var day = date.getDay();
            return day > 0 && day < 6;
        };

        $scope.turnoDate = new Date();

        $scope.createTurno = function (ev) {
            var turno = {
                fechaTurno: $scope.turnoDate
            };
            $scope.showDetails(ev, turno);
        };

        $scope.showSimpleToast = function(text) {

            $mdToast.show(
                $mdToast.simple()
                    .textContent(text)
                    .hideDelay(3000)
            );
        };

        $scope.showDetails = function (ev, turno) {
            $mdDialog.show({
                templateUrl: 'partials/turnos.dialog.html',
                targetEvent: ev,
                clickOutsideToClose: false,
                controller: 'TurnosDialog',
                escapeToClose: true,
                locals: {turno: turno, tiposDeTurno: $scope.tiposDeTurno},
                focusOnOpen: true
            }).then(function (turno) {

                TurnosServices.createTurno(turno);

                $scope.turnos.push(turno);

                if($scope.turnos.length > 1){
                    $scope.turnos = orderTurnosPorHorarios($scope.turnos);
                }

                var turnosRetornados = reloadTurnos();
                if(turnosRetornados){
                    $scope.turnos = turnosRetornados;
                }

                $scope.showSimpleToast("Turno Creado!");

            });

        };

        $scope.cancelarTurno = function(ev, turnoId) {

            var confirm = $mdDialog.confirm()
                .title('Cancelar turno')
                .textContent('El turno seleccionado sera eliminado.')
                .targetEvent(ev)
                .ok('Cancelar')
                .cancel('Salir');

            $mdDialog.show(confirm).then(function() {
                TurnosServices.deleteTurno(turnoId);
                $scope.turnos = _.reject($scope.turnos, function(turno) { return turno.id === turnoId; });
                $scope.showSimpleToast("Turno Cancelado!");
            }, function() {
                $scope.status = 'You decided to keep your debt.';
            });
        };

        $scope.imprimirTurnosDelDia = function(ev) {

            var confirm = $mdDialog.confirm()
                .title('Imprimir turnos del dia')
                .textContent('Los turnos del dia seleccionado seran exportados para ser imprimidos.')
                .targetEvent(ev)
                .ok('Ok')
                .cancel('Cancelar');

            $mdDialog.show(confirm).then(function() {
                var url = $state.href('turnos.export', {date: $scope.turnoDate.getTime()});
                window.open(url,'_blank');
            }, function() {
                $scope.status = 'You decided to keep your debt.';
            });
        };
    })

    .controller('TurnosListExportController', function($stateParams, $scope, turnos, clientes, keyvalues) {

        $scope.dia = turnos[0].fechaTurno;

        $scope.tiposDeTurno = _.where(keyvalues, {groupName: 'TIPOS_DE_TURNO'});

        var orderTurnosPorHorarios = function(turnos){
            return _.sortBy(turnos, function (turno) {
                if(typeof turno.horario == "object"){
                    return turno.horario.getTime();
                }
                if(typeof turno.horario == "string"){
                    return new Date(turno.horario).getTime();
                }
            })
        }

        $scope.turnos = orderTurnosPorHorarios(turnos);

    })

    .controller('TurnosDialog', function ($scope, $mdDialog, $mdpTimePicker, ClientesServices, _, turno, $mdToast, tiposDeTurno) {

        $scope.tiposDeTurno = tiposDeTurno;

        $scope.$watch('turno.tipoDeTurno', function(newValue, oldValue){
            if(oldValue != newValue){
                if(newValue == 'Control'){
                    $scope.turno.duracion = parseInt(_.findWhere($scope.tiposDeTurno, {key: 'Control'}).value);
                }
                if(newValue == 'Estudio'){
                    $scope.turno.duracion = parseInt(_.findWhere($scope.tiposDeTurno, {key: 'Estudio'}).value);
                }
                if(newValue == 'Consulta'){
                    $scope.turno.duracion = parseInt(_.findWhere($scope.tiposDeTurno, {key: 'Consulta'}).value);
                }
            }
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

        $scope.turno = turno;

        $scope.clienteSearch = null;

        ClientesServices.getClientes().then(function (response) {
            $scope.clientes = response;

            _.each($scope.clientes, function (cliente) {
                cliente.$$searchField = cliente.dni + " " + cliente.apellido + " " + cliente.nombre;
                cliente.$$searchFieldToLower = angular.lowercase(cliente.$$searchField);
            })
        });


        function querySearch (query) {
            var queriedClientes = $scope.clientes.filter( createFilterFor(query) );
            return query ?  queriedClientes : $scope.clientes;
        }

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(cliente) {
                var indexOf = cliente.$$searchFieldToLower.indexOf(lowercaseQuery);
                return indexOf !== -1;
            };
        }

        $scope.canSave = function(){
            if($scope.turno.tipoDeTurno && $scope.turno.descripcion && $scope.turno.duracion && $scope.turno.horario && $scope.turno.cliente){
                return false;
            }
            return true;
        };


        $scope.selectedClienteChange = function (cliente){
            $scope.turno.cliente = cliente;
        }

        $scope.querySearch = querySearch;

        $scope.createTurno = function createTurno() {
            $mdDialog.hide($scope.turno);
        };

        $scope.closeDialog = function () {
            $mdDialog.cancel();
        };
    })

    app.controller('TurnosRecordController', ['$scope','$resource', function($scope,$resource) {
        $scope.stateName = 'About AVIO Consulting';

    }]);
})(networkautomation);
