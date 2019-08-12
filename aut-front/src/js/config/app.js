var networkautomation = angular.module('networkautomation', ['ngMaterial', 'ngAnimate', 'ngMessages', 'ngAria', 'ui.router', 'md.data.table',
    'ngResource', 'n3-pie-chart', 'md.time.picker']);

(function(app) {

    app.constant('_',
        window._
    );

    app.directive('listSearch', function() {
        return {
            replace: true,
            scope: {
                searchText: '=',
                disabled: '=ngDisabled',
                placeholder: '@',
                showClearButton: '='
            },
            controller: function ($scope) {
                $scope.clearSearchText = function() {
                    $scope.query= undefined;
                };
            },
            templateUrl: 'partials/list_search.html'
        };
    });

    app.config(['$stateProvider', '$urlRouterProvider', '$qProvider', function($stateProvider, $urlRouterProvider, $qProvider) {

        $qProvider.errorOnUnhandledRejections(false);

        $urlRouterProvider.otherwise('/');

        $stateProvider.state('home', {
            url: '/',
            templateUrl: 'partials/home.html',
            controller: 'HomeController',
            resolve: {
                usuarios: function (UsuariosServices){
                    return UsuariosServices.getUsuarios();
                }
            }
        })

        .state('login', {
            url: '/login',
            templateUrl: 'partials/login.html',
            controller: 'LoginController',
            resolve: {
                usuarios: function (UsuariosServices){
                    return UsuariosServices.getUsuarios();
                }
            }
        })

        .state('turnos', {
            abstract: true,
            url: '/turnos',
            template: '<div ui-view class="page-transition"></div>'
        })

        .state('turnos.list', {
            url: '/list',
            views: {
                "": {
                    templateUrl: 'partials/turnos.html',
                    controller: 'TurnosListController',
                },
            },
            require: 'js/iic-underscore.js',
            resolve: {
                clientes: function (ClientesServices){
                    return ClientesServices.getClientes()
                },
                turnos: function (TurnosServices){
                    return TurnosServices.getTurnos(Date.now());
                },
                keyvalues : function (KeyValueServices) {
                    return KeyValueServices.getKeyValues()
                }
            }
        })

        .state('turnos.export', {
            url: '/export/:date',
            views: {
                "": {
                    templateUrl: 'partials/turnos.export.html',
                    controller: 'TurnosListExportController',
                },
            },
            params: { },
            require: 'js/iic-underscore.js',
            resolve: {
                clientes: function (ClientesServices){
                    return ClientesServices.getClientes()
                },
                turnos: function ($stateParams, TurnosServices){
                    return TurnosServices.getTurnos($stateParams.date);
                },
                keyvalues : function (KeyValueServices) {
                    return KeyValueServices.getKeyValues()
                }
            }
        })

        .state('turnos.record', {
            url: '/:subId',
            views: {
                "": {
                    templateUrl: 'partials/turnos.record.html',
                    controller: 'TurnosRecordController',
                },
            },

            resolve: {
            }
        })


        .state('clientes', {
            abstract: true,
            url: '/clientes',
            template: '<div ui-view class="page-transition"></div>'
        })

        .state('clientes.list', {
            url: '/list',
            views: {
                "": {
                    templateUrl: 'partials/clientes.html',
                    controller: 'ClientesListController',
                },
            },
            resolve: {
                clientes: function (ClientesServices){
                    return ClientesServices.getClientes()
                },
                keyvalues : function (KeyValueServices) {
                    return KeyValueServices.getKeyValues()
                }
            },
            require: 'js/iic-underscore.js'
        })

        .state('clientes.record', {
            url: '/:subId',
            views: {
                "": {
                    templateUrl: 'partials/clientes.record.html',
                    controller: 'ClientesRecordController',
                },
            },
            resolve: {
                cliente: function ($stateParams, ClientesServices){
                    return ClientesServices.getClienteById($stateParams.subId);
                },
                keyvalues : function (KeyValueServices) {
                    return KeyValueServices.getKeyValues()
                }
            },
        })

        .state('pacientes', {
            abstract: true,
            url: '/pacientes',
            template: '<div ui-view class="page-transition"></div>'
        })

        .state('pacientes.list', {
            url: '/list',
            views: {
                "": {
                    templateUrl: 'partials/pacientes.html',
                    controller: 'PacientesListController',
                },
            },
            resolve: {
                pacientes: function (PacientesServices){
                    return PacientesServices.getPacientes()
                }
            },
            require: 'js/iic-underscore.js'
        })

        .state('pacientes.record', {
            url: '/:subId',
            views: {
                "": {
                    templateUrl: 'partials/pacientes.record.html',
                    controller: 'PacientesRecordController',
                },
            },
            resolve: {
                paciente: function ($stateParams, PacientesServices){
                    return PacientesServices.getPacienteById($stateParams.subId);
                },
/*                dispositivos: function (DispositivosServices){
                    return DispositivosServices.getDispositivos();
                }*/
            },
        })

        .state('keyvalues', {
            abstract: true,
            url: '/keyvalues',
            template: '<div ui-view class="page-transition"></div>'
        })

        .state('usuarios', {
            abstract: true,
            url: '/usuarios',
            template: '<div ui-view class="page-transition"></div>'
        })

        .state('usuarios.list', {
            url: '/list',
            views: {
                "": {
                    templateUrl: 'partials/usuarios.html',
                    controller: 'UsuariosListController',
                },
            },
            resolve: {
                usuarios: function (UsuariosServices){
                    return UsuariosServices.getUsuarios();
                }
            },

            require: 'js/iic-underscore.js'
        })

        .state('dispositivos', {
            abstract: true,
            url: '/dispositivos',
            template: '<div ui-view class="page-transition"></div>'
        })

        .state('dispositivos.list', {
            url: '/list',
            views: {
                "": {
                    templateUrl: 'partials/dispositivos.html',
                    controller: 'DispositivosController',
                },
            },
            resolve : {
/*                dispositivos: function (DispositivosServices){
                    return DispositivosServices.getDispositivos();
                }*/
                dispositivos: ['$http', function($http) {
                    return $http({
                        method: 'GET',
                        url: '/js/json/dispositivos.json'
                    })
                }]
            },
            require: 'js/iic-underscore.js'
        })

        .state('auditoria', {
            abstract: true,
            url: '/auditoria',
            template: '<div ui-view class="page-transition"></div>'
        })

        .state('auditoria.list', {
            url: '/list',
            views: {
                "": {
                    templateUrl: 'partials/auditoria.html',
                    controller: 'AuditoriaController',
                },
            },
            resolve : {

                auditoria: ['$http', function($http) {
                    return $http({
                        method: 'GET',
                        url: '/js/json/auditoria.json'
                    })
                }]
            },
            require: 'js/iic-underscore.js'
        })

        .state('respaldos', {
            abstract: true,
            url: '/respaldos',
            template: '<div ui-view class="page-transition"></div>'
        })

        .state('respaldos.list', {
            url: '/list',
            views: {
                "": {
                    templateUrl: 'partials/respaldos.html',
                    controller: 'RespaldosController',
                },
            },
            resolve : {

                respaldos: ['$http', function($http) {
                    return $http({
                        method: 'GET',
                        url: '/js/json/respaldos.json'
                    })
                }]
            },
            require: 'js/iic-underscore.js'
        })

        .state('redesprivadas', {
            abstract: true,
            url: '/redesprivadas',
            template: '<div ui-view class="page-transition"></div>'
        })

        .state('redesprivadas.list', {
            url: '/list',
            views: {
                "": {
                    templateUrl: 'partials/redesprivadas.html',
                    controller: 'RedesPrivadasController',
                },
            },
            resolve : {

                redesprivadas: ['$http', function($http) {
                    return $http({
                        method: 'GET',
                        url: '/js/json/redesprivadas.json'
                    })
                }]
            },
            require: 'js/iic-underscore.js'
        })


    }]);

    app.controller('AppCtrl', function ($scope, $mdMedia, $mdSidenav, $state, _, $rootScope) {

        if(!$rootScope.logged){
            $state.go('login');
        }

        $scope.currentNavItem = "home";

        $scope.$mdMedia = $mdMedia;

        $scope.$mdSidenav = $mdSidenav;

        $scope.isInState = function isInState(sref) {

            return $state.includes(sref);
        };

        $scope.openSidebar = function() {
            $scope.$mdSidenav('left').toggle();
        };

        $scope.closeSidebar = function() {
            $scope.$mdSidenav('left').close();
        };

        $scope.isSidebarOpen = function() {
            return $scope.$mdSidenav('left').isOpen();
        };

        $scope.goTo = function(state){
            $state.go(state);
        }

    })

    .directive('mainToolbar', function() {
        return {
            replace: true,
            restrict: 'E',
            transclude: true,
            templateUrl: 'partials/main.toolbar.html',
            scope: { 'crumbs': '=' },

            controller: function($scope, $rootScope, $mdSidenav, $mdMedia, $state) {

                $scope.$mdMedia = $mdMedia;

                $scope.$mdSidenav = $mdSidenav;

                $scope.openSidebar = function() {
                    $scope.$mdSidenav('left').toggle();
                };

                $scope.closeSidebar = function() {
                    $scope.$mdSidenav('left').close();
                };

                $scope.isSidebarOpen = function() {
                    return $scope.$mdSidenav('left').isOpen();
                };

            }
        };
    });
    app.service('KeyValueServices', function ($resource) {

        var resource = $resource('/eye-tracking-api/keyvalue', {}, {
            query: {
                method: 'GET',
                headers: [
                    {'Content-Type': 'application/json'}],
                isArray: true
            },
        });


        this.getKeyValues = function getKeyValues() {
            return resource.query({}).$promise;
        };

    });


})(networkautomation);


