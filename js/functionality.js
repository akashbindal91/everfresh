app.controller("HomeController", function($scope, $http) {
    $scope.msg = "HomeController";
});

app.controller("AdminController", function($scope, $http) {
    $scope.msg = "AdminController";
    var category = '';
    var fi = [];

    $scope.submitCategory = function(category) {
        var cat = (category.toLowerCase()).replace(/\s/g, '');
        $http
            ({
                method: 'POST',
                url: BASE_URL + 'index.php/homepage/submitCategory',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    "cat": cat
                })
            })
            .success(function(response) {
                if (response.category_datas == true) {
                    console.log("true");
                    $scope.category = '';
                    category = '';

                } else if (response.category_datas == false) {
                    console.log("false");

                } else {
                    console.log("wrong territory");
                }
            })
    }

    $scope.submitItem = function(fi) {
        var cat = ((fi.category).toLowerCase()).replace(/\s/g, '');
        var item = ((fi.item).toLowerCase()).replace(/\s/g, '');
        var price = ((fi.price).toLowerCase()).replace(/\s/g, '');
        $http
            ({
                method: 'POST',
                url: BASE_URL + 'index.php/homepage/submitItemWithRate',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    "cat": cat,
                    "item": item,
                    "price": price
                })
            })
            .success(function(response) {
                console.log(response);
                // if (response.category_datas == true) {
                // 	console.log("true");
                // 	$scope.category = '';
                // 	category = '';

                // } else if (response.category_datas == false) {
                // 	console.log("false");

                // } else {
                // 	console.log("wrong territory");
                // }
            })
    }

});

// ===========================================================================================
// ===========================================================================================
app.controller("BillingController", function($scope, $http) {
    $scope.msg = "BillingController";
    
    $scope.checkOutRate = [];

    $scope.getCategoriesFromDataBase = function() {
        $http({
                method: 'GET',
                url: BASE_URL + 'index.php/homepage/get_categories_from_database'
            })
            .success(function(data) {
                $scope.category = data.categories;
            });
    }

    $scope.catSelectFoodItems = function(cat) {
        var catId = cat.id;
        $http({
                method: 'GET',
                url: BASE_URL + 'index.php/homepage/get_catwise_food_items_from_database/' + catId,
            })
            .success(function(data) {
                console.log(data);
                $scope.foodItems = data.foodItems;
                if (data.foodItems.length > 0) {
                    $scope.foodItemsAvailable = true;
                } else {
                    $scope.foodItemsAvailable = false;
                }
            });
    }

    $scope.selectItemsRate = function(items) {
        var itemcode = items.id;
        var rateLen = $scope.checkOutRate.length;
        var rate = $scope.checkOutRate;

        $http
            ({
                method: 'POST',
                url: BASE_URL + 'index.php/homepage/getItemDetail',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    "itemCode": itemcode
                })
            })
            .success(function(response) {
                response.quantity = 1;
                rate.push(response);

                $scope.checkOutRate = rate;
            })
    }

    $scope.submititemcode = function(itemcode) {
        $http
            ({
                method: 'POST',
                url: BASE_URL + 'index.php/homepage/getItemDetail',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    "itemCode": itemcode
                })
            })
            .success(function(response) {
                rate.push(response);
                $scope.checkOutRate = rate;
            })
    }

    $scope.final = [];
    $scope.final.quantity = 1;

    $scope.removeItem = function(index) {
        $scope.checkOutRate.splice(index, 1);
    }

    $scope.total = function() {
        var total = 0;
        angular.forEach($scope.checkOutRate, function(final) {
            total += final.quantity * final.price_id;
        })

        return total;
    }

    $scope.printBill = function() {
    	var ttlBill = 0;
        angular.forEach($scope.checkOutRate, function(final) {
            ttlBill += final.quantity * final.price_id;
        })
    }

});