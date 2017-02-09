var app = angular.module  ( "myApp", ["ngRoute"] );
//=======================================================================
// ROUTE PROVIDER
//=======================================================================
app.config(function($routeProvider) {
    $routeProvider
    .when("#", {
        templateUrl : BASE_URL + 'index.php/homepage/index',
    })
    .when("/AdminPanel", {
        templateUrl : BASE_URL + 'index.php/homepage/mainView',
        controller : "AdminController"
    })
    .when("/BillingPanel", {
        templateUrl : BASE_URL + 'index.php/homepage/secondView',
        controller : "BillingController"
    });
});