app.controller("HomeController", function($scope, $http) {
    $scope.msg = "HomeController";
});

app.controller("AdminController", function($scope, $http) {
    $scope.msg = "AdminController";
    var category = '';
    var fi = {};
    $scope.names = [];
    // fi.regular = false;
    // $scope.fi.regular = false;
    // $scope.fi = [];
    // $scope.fi = 

    $scope.showValue = function(vv) {
        console.log(vv);
    }

    $scope.categoryList = function() {
        $http.get(BASE_URL + 'index.php/homepage/get_Category_List')
            .success(function(response) {
                console.log(response);
                $scope.names = response.categories;
                console.log(response.categories);
            })
    }

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
                    $scope.category = '';
                    category = '';
                    $scope.categoryList();
                } else if (response.category_datas == false) {
                    console.log("dublicate entry");
                } else {
                    console.log("wrong territory");
                }
            })
    }

    var regularDish = "null";
    var smallDish = "null";
    var mediumDish = "null";
    var largeDish = "null";
    var extralargeDish = "null";
    
    var regularDishPrice = "null";
    var smallDishPrice = "null";
    var mediumDishPrice = "null";
    var largeDishPrice = "null";
    var extralargeDishPrice = "null";


    $scope.submitItem = function(fi) {
        var val = 'success';

        if (fi.category == undefined) {
            return;
        }

        if (fi.item == undefined) {
            return;
        }

        if (fi.regular == true) {
            if (fi.regular_price == undefined) {
                val = 'error';
                console.log("wrong value entered");
                return;
            } else if (fi.regular_price == 0) {
                val = 'error';
                console.log("wrong value entered");
                return;
            } else {
                val = 'success';
                // regularDish = (fi.regular.toLowerCase()).replace(/\s/g, '');
                // regularDishPrice = ((fi.regular_price).toLowerCase()).replace(/\s/g, '');
                regularDish = fi.item  + "regular";
                regularDishPrice = fi.regular_price;

            }
        } else {
            regularDish = "null";
            regularDishPrice = 'null';
        }

        if (fi.small == true) {
            if (fi.small_size_price == undefined) {
                val = 'error';
                console.log("wrong value entered");
                return;
            } else if (fi.small_size_price == 0) {
                val = 'error';
                console.log("wrong value entered");
                return;
            } else {
                
                val = 'success';
                smallDish = fi.item + "small";
                smallDishPrice = fi.small_size_price;
            }
        } else {
            smallDish = 'null';
            smallDishPrice = 'null';
        }

        if (fi.medium == true) {
            if (fi.medium_size_price == undefined) {
                val = 'error';
                console.log("wrong value entered");
                return;
            } else if (fi.medium_size_price == 0) {
                val = 'error';
                console.log("wrong value entered");
                return;
            } else {
                
                val = 'success';
                mediumDish = fi.item + "medium";
                mediumDishPrice = fi.medium_size_price;
            }
        } else {
            mediumDish = "null";
                mediumDishPrice = "null";
        }

        if (fi.large == true) {
            if (fi.large_size_price == undefined) {
                val = 'error';
                console.log("wrong value entered");
                return;
            } else if (fi.large_size_price == 0) {
                val = 'error';
                console.log("wrong value entered");
                return;
            } else {
                val = 'success';
                largeDish = fi.item + "large";
                largeDishPrice = fi.large_size_price;
            }
        } else {
            largeDish = "null";
                largeDishPrice = 'null';
        }

        if (fi.extralarge == true) {
            if (fi.extralarge_size_price == undefined) {
                val = 'error';
                console.log("wrong value entered");
                return;
            } else if (fi.extralarge_size_price == 0) {
                val = 'error';
                console.log("wrong value entered");
                return;
            } else {
                val = 'success';
                extralargeDish = fi.item + 'xlarge';
                extralargeDishPrice = fi.extralarge_size_price;
            }
        } else {
            extralargeDish = 'null';
                extralargeDishPrice = 'null';
        }

        var cat = ((fi.category).toLowerCase()).replace(/\s/g, '');

        // var itemsList = [
        //     { regularDish : regularDish , regularDishPrice : regularDishPrice},
        //     { smallDish : smallDish , smallDishPrice : smallDishPrice },
        //     { mediumDish : mediumDish , mediumDishPrice : mediumDishPrice },
        //     { largeDish : largeDish , largeDishPrice : largeDishPrice },
        //     { extralargeDish : extralargeDish , extralargeDishPrice : extralargeDishPrice },
        // ];

        $http
            ({
                method: 'POST',
                url: BASE_URL + 'index.php/homepage/submitItemWithRate',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    "cat": cat,
                    "item": fi.item,
                    'regularDish' : regularDish , 
                    'regularDishPrice' : regularDishPrice,
                    'smallDish' : smallDish ,
                    'smallDishPrice' : smallDishPrice,
                    'mediumDish' : mediumDish,
                    'mediumDishPrice' : mediumDishPrice,
                    'largeDish' : largeDish ,
                    'largeDishPrice' : largeDishPrice,
                    'extralargeDish' : extralargeDish ,
                    'extralargeDishPrice' : extralargeDishPrice,
                })
            })
            .success(function(response) {
                console.log(response);
                // if (response.category_datas == true) {
                //  console.log("true");
                //  $scope.category = '';
                //  category = '';

                // } else if (response.category_datas == false) {
                //  console.log("false");

                // } else {
                //  console.log("wrong territory");
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
                $scope.foodItems = data.foodItems;
                if (data.foodItems.length > 0) {
                    $scope.foodItemsAvailable = true;
                } else {
                    $scope.foodItemsAvailable = false;
                }
            });
    }

    var checkItm = [];
    var singleItem_name = [];

    $scope.selectItemsRate = function(items) {
        var itemcode = items.id;
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

                if (response.length == 1) {

                    if (singleItem_name.includes(String(response[0].item_name))) {
                        var ind = singleItem_name.indexOf(String(response[0].item_name));
                        checkItm[ind].quantity = checkItm[ind].quantity + 1;
                    } else {
                        response[0].quantity = 1;
                        checkItm.push(response[0]);
                        singleItem_name.push(response[0].item_name);
                    }

                    $scope.checkOutRate = checkItm;

                } else {

                }
                // return;
                // response.quantity = 1;
                // rate.push(response);
                // $scope.checkOutRate = rate;

                // ================================================================
                // ================================================================

                // if (singleItem_name.includes(String(response.item_name))) {
                //     var ind = singleItem_name.indexOf(String(response.item_name));
                //     checkItm[ind].quantity = checkItm[ind].quantity + 1;
                // } else {
                //     response.quantity = 1;
                //     checkItm.push(response);
                //     singleItem_name.push(response.item_name);
                // }

                // $scope.checkOutRate = checkItm;
            })
    }

    // $scope.submititemcode = function(itemcode) {
    //     $http
    //         ({
    //             method: 'POST',
    //             url: BASE_URL + 'index.php/homepage/getItemDetail',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             data: JSON.stringify({
    //                 "itemCode": itemcode
    //             })
    //         })
    //         .success(function(response) {
    //             if (singleItem_name.includes(String(response.item_name))) {
    //                 var ind = singleItem_name.indexOf(String(response.item_name));
    //                 checkItm[ind].quantity = checkItm[ind].quantity + 1;
    //             } else {
    //                 response.quantity = 1;
    //                 checkItm.push(response);
    //                 singleItem_name.push(response.item_name);
    //             }

    //             $scope.checkOutRate = checkItm;
    //         })
    // }

    $scope.final = [];
    $scope.final.quantity = 1;

    $scope.removeItem = function(index) {
        singleItem_name.splice(index, 1);
        checkItm.splice(index, 1);
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