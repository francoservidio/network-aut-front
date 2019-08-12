
(function(app) {
    app.service('ClientesServices', function ($resource) {

        var resource = $resource('/eye-tracking-api/clientes', {}, {
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

        var resource2 = $resource('/eye-tracking-api/clientes/:id', {}, {
            get:{
                method: 'GET'
            }
        });

        this.getClientes = function getClientes(){
            return resource.query({}).$promise;
        };
        this.createCliente = function createCliente(cliente){
            return resource.create(cliente);
        }
        this.updateCliente = function updateCliente(cliente){
            return resource.update(cliente).$promise;
        }
        this.getClienteById = function getClienteById(id){
            return resource2.get({id: id}).$promise;
        }

    })

    app.controller('ClientesListController', function($scope, $resource, $state, _, $mdDialog, $rootScope, $mdToast, clientes, ClientesServices, keyvalues) {

        'use strict';
        $scope.obrasSociales = _.where(keyvalues, {groupName: 'OBRAS_SOCIALES'});

        $scope.showSimpleToast = function(text) {

            $mdToast.show(
                $mdToast.simple()
                    .textContent(text)
                    .hideDelay(3000)
            );
        };

        $scope.clientes = clientes;

        $scope.query = [];

        $scope.search = function (row) {
            var isIt = (angular.lowercase(row.dni).indexOf(angular.lowercase($scope.query) || '') !== -1 ||
                angular.lowercase(row.nombre).indexOf(angular.lowercase($scope.query) || '') !== -1 ||
                angular.lowercase(row.apellido).indexOf(angular.lowercase($scope.query) || '') !== -1);

            return isIt;
        };

        $scope.goTo = function goTo(clienteId) {
            $state.go('clientes.record', {subId: clienteId}, {reload:true});
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

            var cliente = {

            }

            $scope.showDetails(ev, cliente);
        };

        $scope.showDetails = function (ev, cliente) {
            $mdDialog.show({
                templateUrl: 'partials/clientes.dialog.html',
                targetEvent: ev,
                clickOutsideToClose: false,
                controller: 'ClientesDialog',
                escapeToClose: true,
                locals: {cliente: cliente, obrasSociales: $scope.obrasSociales},
                focusOnOpen: true
            }).then(function (cliente) {

                $scope.clientes.push(cliente);

                ClientesServices.createCliente(cliente);

                $scope.showSimpleToast("Cliente Creado");

            });

        };

    })

    .controller('ClientesDialog', function ($scope, $mdDialog, cliente, obrasSociales) {

        $scope.obrasSociales = obrasSociales;
        $scope.cliente = cliente;

        $scope.canSave = function(){
            if($scope.cliente.nombre && $scope.cliente.apellido && $scope.cliente.dni && $scope.cliente.email && $scope.cliente.obraSocial){
                return false;
            }
            return true;
        };

        $scope.saveCliente = function saveCliente() {
            $mdDialog.hide($scope.cliente);
        };

        $scope.closeDialog = function () {
            $mdDialog.cancel();
        };

    })

    .controller('ClientesReporteDialog', function ($scope, $mdDialog, cliente, obrasSociales) {

        $scope.obrasSociales = obrasSociales;
        $scope.cliente = cliente;

        $scope.saveCliente = function saveCliente() {
            $mdDialog.hide($scope.cliente);
        };

        $scope.closeDialog = function () {
            $mdDialog.cancel();
        };

    })

    app.controller('ClientesRecordController', function($scope, $resource, $state, cliente, $stateParams, _, $mdToast, $timeout, ClientesServices, keyvalues, $mdDialog) {

        'use strict';


        $scope.imprimirReporte = function (ev) {
            $mdDialog.show({
                templateUrl: 'partials/clientes.reporte.dialog.html',
                targetEvent: ev,
                clickOutsideToClose: false,
                controller: 'ClientesReporteDialog',
                escapeToClose: true,
                locals: {cliente: cliente, obrasSociales: $scope.obrasSociales},
                focusOnOpen: true
            }).then(function (cliente) {

/*                $scope.clientes.push(cliente);

                ClientesServices.createCliente(cliente);

                $scope.showSimpleToast("Cliente Creado");*/

            });

        };

        $scope.obrasSociales = _.where(keyvalues, {groupName: 'OBRAS_SOCIALES'});

        $scope.cliente = cliente;

        $scope.clienteOriginal = angular.copy($scope.cliente);

        $scope.$watch('cliente', function(newValue){
            if (!angular.equals(newValue, $scope.clienteOriginal)){
                $scope.allowedToSave = true;
            }else{
                $scope.allowedToSave = false;
            }
        }, true);

        $scope.$watch('clienteOriginal', function(newValue){
            if (!angular.equals(newValue, $scope.cliente)){
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

        $scope.goBack = function(){
            $state.go('clientes.list');
        };

        $scope.updateCliente = function (){
            ClientesServices.updateCliente($scope.cliente).then(function (response) {
                $scope.cliente = response;

                //$scope.clienteOriginal = null;
                $scope.clienteOriginal = angular.copy($scope.cliente);
            });

            $scope.showSimpleToast("Cambios guardados!");

        }

        $scope.clientes = [
            {
                nombre: "Homero",
                apellido: "Simpson",
                dni: "75936187",
                email: "hsimpson@gmail.com",
                id: 0
            },
            {
                nombre: "Marge",
                apellido: "Simpson",
                dni: "33548121",
                email: "msimpson@gmail.com",
                id: 1
            },
            {
                nombre: "Bart",
                apellido: "Simpson",
                dni: "25115912",
                email: "bsimpson@gmail.com",
                id: 2
            },
            {
                nombre: "Lisa",
                apellido: "Simpson",
                dni: "63049309",
                email: "lsimpson@gmail.com",
                id: 3
            },
            {
                nombre: "Maggie",
                apellido: "Simpson",
                dni: "91920973",
                email: "msimpson@gmail.com",
                id: 4
            },
            {
                nombre: "Abraham",
                apellido: "Simpson",
                dni: "65788887",
                email: "asimpson@gmail.com",
                id: 5
            },
            {
                nombre: "Charles",
                apellido: "Montgomery Burns",
                dni: "56694064",
                email: "cmontgomeryburns@gmail.com",
                id: 6
            },
            {
                nombre: "Waylon",
                apellido: "Smithers",
                dni: "94647096",
                email: "wsmithers@gmail.com",
                id: 7
            },
            {
                nombre: "Seymour",
                apellido: "Skinner",
                dni: "50851793",
                email: "sskinner@gmail.com",
                id: 8
            },
            {
                nombre: "Apu",
                apellido: "Nahasapee mapetilon",
                dni: "07878800",
                email: "anahasapee-mapetilon@gmail.com",
                id: 9
            },
            {
                nombre: "Otto",
                apellido: "Mann",
                dni: "86494307",
                email: "omann@gmail.com",
                id: 10
            },
            {
                nombre: "Maude",
                apellido: "Flanders",
                dni: "07405373",
                email: "mflanders@gmail.com",
                id: 11
            },
            {
                nombre: "Ned",
                apellido: "Flanders",
                email: "nflanders@gmail.com",
                dni: "29157184",
                id: 12
            },
            {
                nombre: "Todd",
                apellido: "Flanders",
                dni: "76426685",
                email: "tflanders@gmail.com",
                id: 13
            },
            {
                nombre: "Rod",
                apellido: "Flanders",
                dni: "40168958",
                email: "rflanders@gmail.com",
                id: 14
            },
            {
                nombre: "Lenny",
                apellido: "Leonard",
                dni: "57227004",
                email: "lleonard@gmail.com",
                id: 15
            },
            {
                nombre: "Carl",
                apellido: "Carlson",
                dni: "72720845",
                email: "ccarlson@gmail.com",
                id: 16
            },
            {
                nombre: "Barney",
                apellido: "Gómez",
                dni: "64332939",
                email: "bgómez@gmail.com",
                id: 17
            },
            {
                nombre: "Moe",
                apellido: "Szyslak",
                dni: "40373979",
                email: "mszyslak@gmail.com",
                id: 18
            },
            {
                nombre: "Patty",
                apellido: "Bouvier",
                email: "pbouvier@gmail.com",
                id: 19,
                dni: "73678246"
            },
            {
                nombre: "Selma",
                apellido: "Bouvier",
                dni: "49963103",
                email: "sbouvier@gmail.com",
                id: 20
            },
            {
                nombre: "Krusty",
                apellido: "el Payaso",
                dni: "36898064",
                email: "krustyelpayaso@gmail.com",
                id: 21
            },
            {
                nombre: "Clancy",
                apellido: "Gorgori",
                dni: "25790340",
                email: "cgorgori@gmail.com",
                id: 22
            },
            {
                nombre: "Edna",
                apellido: "Krabappel",
                dni: "10823526",
                email: "ekrabappel@gmail.com",
                id: 23
            },
            {
                nombre: "Jeff",
                apellido: "Albertson",
                dni: "41199330",
                email: "jalbertson@gmail.com",
                id: 24
            },
            {
                nombre: "Nelson",
                apellido: "Rufino",
                dni: "43332629",
                email: "nrufino@gmail.com",
                id: 25
            },
            {
                nombre: "Martin",
                apellido: "Prince",
                dni: "42873255",
                email: "mprince@gmail.com",
                id: 26
            },
            {
                nombre: "Rafa",
                apellido: "Gorgory",
                dni: "86845625",
                email: "rgorgory@gmail.com",
                id: 27
            },
            {
                nombre: "Milhouse",
                apellido: "Mussolini Van Houten",
                dni: "96650615",
                email: "mussolinivanhouten@gmail.com",
                id: 28
            },
            {
                nombre: "Herbert",
                apellido: "Powell",
                dni: "52603542",
                email: "hpowell@gmail.com",
                id: 29
            },
            {
                nombre: "Jacqueline",
                apellido: "Bouvier",
                dni: "53556454",
                email: "jbouvier@gmail.com",
                id: 30
            },
            {
                nombre: "Todd",
                apellido: "Flanders",
                dni: "71200448",
                email: "tflanders@gmail.com",
                id: 31
            },
            {
                nombre: "Rod",
                apellido: "Flanders",
                dni: "98331258",
                email: "rflanders@gmail.com",
                id: 3
            }
        ];

    });

/*    app.filter('servicesFilter', ['collectionFilterFactory', function (collectionFilterFactory) {
        return collectionFilterFactory([
            "status",
            "label",
        ]);
    }])*/
})(networkautomation);
