var app = angular.module  ( "myApp", [  "ngRoute", "ngResource", 'ngSanitize','ngCookies', 'ngStorage' ] );
//=======================================================================
// ROUTE PROVIDER
//=======================================================================
app.config  ( function  ( $routeProvider  )
{
  $routeProvider
  .when(  "#", {	templateUrl : "usernew/index"	})
  .when(  "/signup",  {	templateUrl : "usernew/signupView",	controller : "signupController" })
  .when(  "/homepage"	, {	templateUrl : "usernew/articleView", controller: "articleController"	})
  .when(  "/insert"	,  {	templateUrl : "usernew/insertView",	controller : "insertController" })
  .when(  "/update",  {	templateUrl : "usernew/updateView",	controller : "updateController" })
  .when(  "/update/:uid",  {	templateUrl : "usernew/updateHere",	controller : "updateHereController" })
  .when(  "/comment/:cid", {	templateUrl : "usernew/commentView",	controller : "commentController" });
});

//=================================================================
// NG-RESOURCE FACTORY
//=================================================================
app.factory('UserGetAll', function ($resource)
{
      return $resource('usernew/read',{}, {read_Data:{	method:'GET'}
  });
});

//=================================================================
// HOME CONTROLLER
//=================================================================
app.controller (  'homeController', function ($scope,$http,$location,$routeParams,$cookies)
{
	$scope.insert = {};
	$scope.log = {};
	$scope.log.email = "";
	$scope.log.password = "";
	
	var mycookiecode = $cookies.get('user_name');
	
	if (!$cookies.get('user_name'))
	{
	 	$scope.login = false;
		$scope.welcome = true;
	}
	else
	{
		$scope.login = true;
		$scope.welcome = false;
	}

	$scope.lookup_login = function(log)
	{
		var eml = $scope.log.email;
		var email = eml.toLowerCase();

		var pass = $scope.log.password;
		var password = pass.toLowerCase();


		$http
		({
			method: 'POST',
			url: BASE_URL  + 'index.php/usernew/lookup_login',
	        headers: { 'Content-Type': 'application/json'  },
	        data:JSON.stringify({  "email" :email, "password" : password })
		})
		.success (	function(response)
		{
			if(response.response == false)
			{
				alert("YOU ARE NOT A USER");
			}
			else
			{
  		 		var today = new Date();
				var expired = new Date(today);
				expired.setDate(today.getDate() + 1);
  				$cookies.put('user_name', email, {expires: expired, path : '/' });

  				alert("welcome");

				$scope.welcome = !$scope.welcome;
				$scope.login = !$scope.login ;
				$scope.log.email = "";
				$scope.log.password = "";
    		}
		})
	}

	$scope.logout = function()
	{
		var today = new Date();
		var expired = new Date(today);
	
		$cookies.remove('user_name', {expires: expired, path : '/' });
		$scope.welcome = !$scope.welcome;
		$scope.login = !$scope.login ;
		$scope.log.email = "";
		$scope.log.password = "";

	
		alert("you have been logged out");
		$location.path("usernew/index");
	}
});

//=================================================================
// SIGNUP CONTROLLER
//=================================================================
app.controller (  'signupController', function ($scope,$http,$location,$routeParams,$cookies)
{
	$scope.signup = {};

	$scope.lookup_signup = function(signup)
	{
		var semail = $scope.signup.email;
		var sign_email = semail.toLowerCase();

		var pass = $scope.signup.password;
		var sign_password = pass.toLowerCase();

		var user = $scope.signup.user_name;
		var sign_user_name = user.toLowerCase();

		$http
		({
			method: 'POST',
			url: BASE_URL  + 'index.php/usernew/lookup_signup',
	        headers: { 'Content-Type': 'application/json'  },
	        data:JSON.stringify({  "email" :sign_email, "password" : sign_password, "name": sign_user_name })
		})
		.success (	function(response)
		{
			if(response.response == false)
			{
				alert("THIS ID IS ALREADY REGISTERED TRY SOMEHING NEW");
			}
			else
			{
				alert("YOU HAVE SUCCESSFULLY SIGNED UP");
				$scope.signup.email = "";
				$scope.signup.password = "";
				$scope.signup.user_name = "";

			}
		})
	}
});

//===================================================================================
// ARTICLE CONTROLLER
//===================================================================================

// needed for pagination
app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; 
        return input.slice(start);
    }
});

app.controller (  'articleController', function ( $scope,$http,$location,UserGetAll,$routeParams,$cookies )
{
	$scope.pageSize = 10;
    $scope.currentPage = 0;
	$scope.welcome = false;
	$scope.login = true;

	$scope.getArticles = function()
	{
		UserGetAll.read_Data({},function(user)
		{
			self.original = user;
			$scope.response = new UserGetAll(self.original );
			getallcategories();

			// PAGINATION STARTS
			var dats = $scope.response.results;
			pagination(dats);
		})
	}

	function pagination(dats) {
        var res_len = dats.length;

        $scope.numberOfPages = function() {
            $scope.page_size = Math.ceil( res_len / $scope.pageSize); 
            return  $scope.page_size;             
        }
        for (var i=0; i < res_len; i++) {
            $scope.article_details = dats;
        }
    }
    // PAGINATION ENDS

	function getallcategories()
	{
		$http({
	        method: 'GET',
	        url: BASE_URL  + 'index.php/usernew/getallcategories'
	        })
	      	.success  ( function( data)
	      	{
				$scope.article_categories = data.categories;
	      	});
	}

	$scope.getCategoryData = function(article_category)
	{
		$http({
	        method: 'POST',
	        url: BASE_URL  + 'index.php/usernew/getCategoryData',
	        headers: { 'Content-Type': 'application/json'  },
	        data:JSON.stringify({  "categ" :article_category.selectedCategory})
	        })
	      	.success  ( function( data)
	      	{
				$scope.article_details = data.category_datas;
	      	});
	}

	// for getting data that need to be view and to be commented upon
    $scope.commenting = function  ( article_detail  )
    {
		$location.path (	'comment/'	+ article_detail.u_id  );
    }
});

//=============================================================================
// INSERT CONTROLLER
//=============================================================================
app.controller (  'insertController', function ( $scope,$http,$location,$cookies,$localStorage, $sessionStorage )
{
	$scope.insert = {};
	CKEDITOR.replace( 'blog_article' );

	//defining database
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

	if (!window.indexedDB)
	{
    	alert("Sorry!Your browser doesn't support IndexedDB");
	}

	var request = window.indexedDB.open("blog_article_details",1);
	var db;

    request.onerror = function(event)
	{
		console.log(event.target.errorCode);
	};

	request.onsuccess = function(event)
	{
    	db=request.result;
	};

	request.onupgradeneeded = function(event)
	{
	    var db = event.target.result;
	    var objectStore = db.createObjectStore("blog_article_store", { keyPath:  "u_id",autoIncrement:true});
	};

    $scope.blog_insertForm = function (  insert  )
    {	

      	$scope.insert.article = CKEDITOR.instances.blog_article.getData();

    	if ( confirm (  "R U SURE U WANNA insert!!!"  ) == true )
	    {
    		article 	= CKEDITOR.instances.blog_article.getData();
			writer 		= $scope.insert.blog_writer ;
		    title 		= $scope.insert.blog_title;
		    category 	= $scope.insert.blog_categ;

	    	var transaction = db.transaction(["blog_article_store"], "readwrite");
			var objectStore = transaction.objectStore("blog_article_store");

			var data_submit={title: title, article: article, writer: writer, category: category };
			var request=objectStore.put(data_submit);
			
			request.onsuccess = function(event)
			{
				CKEDITOR.instances.blog_article.setData();
				$scope.insert.blog_writer  = "";
			    $scope.insert.blog_title  = "";
			    $scope.insert.blog_categ  = "";
				
				if (navigator.onLine)
				{ 
					$scope.readAll();
					//console.log("2");
				}
				else
				{
					console.log("u r offline ur data will be uploaded next time when u will be online");
				}
			}
		}
	}

	$scope.readAll = function() 
	{
		console.log("4");

		var objectStore = db.transaction("blog_article_store").objectStore("blog_article_store");
		objectStore.openCursor().onsuccess = function(event) 
		{
			var cursor = event.target.result;

			if (cursor) 
			{
			
				$http({
			        method: 'POST',
			        url: BASE_URL  + 'index.php/usernew/insert_indexed_article' ,
			        headers: { 'Content-Type': 'application/json'  },
			        data:JSON.stringify({ "article":cursor.value.article, "writer":cursor.value.writer, "title":cursor.value.title , "categ" :cursor.value.category})
				})
		  		.success  ( function( data)
	      		{
	      			//sometinh
	      		})
	      		cursor.continue();
			}
			else
			{
				console.log("No more entries!");
				if (navigator.onLine) 
				{
					delete_indexed_data();
				}	
			}
		}	
	}

	function delete_indexed_data()
	{
		console.log("aaya");
		console.log("aaya");
		var DBOpenRequest = window.indexedDB.open("blog_article_details", 1);

		DBOpenRequest.onsuccess = function(event)
		{
			// store the result of opening the database in the db variable. This is used a lot below
			db = DBOpenRequest.result;

			// Run the clearData() function to clear all the data form the object store
			clearData();
		};

		function clearData() 
		{
			// open a read/write db transaction, ready for clearing the data
			var transaction = db.transaction(["blog_article_store"], "readwrite");
			// report on the success of opening the transaction
			transaction.oncomplete = function(event)
			{
				console.log("oncomplete");
				//note.innerHTML += '<li>Transaction completed: database modification finished.</li>';
			};

			transaction.onerror = function(event)
			{
				console.log("on error");
				//note.innerHTML += '<li>Transaction not opened due to error: ' + transaction.error + '</li>';
			};
			// create an object store on the transaction
			var objectStore = transaction.objectStore("blog_article_store");
			// clear all the data out of the object store
			var objectStoreRequest = objectStore.clear();

			objectStoreRequest.onsuccess = function(event)
			{
			// report the success of our clear operation
				console.log("on success");
			};
		};
	}

// to decide wether the title is already registered or not
	$scope.decide = function  ( insert  )
	{
		$scope.insert.article = CKEDITOR.instances.blog_article.getData();
	  	$http({

	      	method: 'POST',
		    url: BASE_URL + 'index.php/usernew/checkDataForExistence' ,
			headers: {  'Content-Type': 'application/json'  },
		    data:JSON.stringify({ "title":insert.blog_title,  "writer":insert.blog_writer,"categ" :insert.blog_categ,  "article":insert.blog_article  })
	      	})
	      	.success  ( function  (	response	)
	      	{
	        	if (	response.result == false	)
        	{
        		$scope.blog_insertForm(	insert	);
        	}
        	else
	        {
	          	alert(	"This TITLE is already PRESENT... try something different"	);
	        }
    	});
	}
});

//=======================================================================================
// UPDATE CONTROLLER
//=======================================================================================
app.controller (  'updateController', function ( $scope,$http,$location,UserGetAll,$routeParams, $cookies )
{
	$cookies.get('user_name');
	$scope.abc = "true";

	$scope.getArticles = function()
	{
		UserGetAll.read_Data({},function(user)
		{
			self.original = user;
			$scope.response = new UserGetAll(self.original );
			$scope.article_details = $scope.response.results;
		})
	}
	
	//defining database
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
	//readAll();

	if (!window.indexedDB)
	{
    	alert("Sorry!Your browser doesn't support IndexedDB");
	}

	var request = window.indexedDB.open("blog_article_delete_details",1);
	var db;

    request.onerror = function(event)
	{
		console.log(event.target.errorCode);
	};

	request.onsuccess = function(event)
	{
    	db=request.result;
    	console.log("1");
	};

	request.onupgradeneeded = function(event)
	{
	    var db = event.target.result;
	    var objectStore = db.createObjectStore("blog_article_delete_store", { keyPath:  "u_id",autoIncrement:true});
	    console.log("3");
	};


    $scope.delete = function  ( article_detail  )
    {
    	id 		= article_detail.u_id;
    	console.log(id);
    	if($cookies.get('user_name') != null)
    	{

	    	if ( confirm ( "R U SURE U WANNA DELETE!!!" ) == true  )
		    {
				var transaction = db.transaction(["blog_article_delete_store"], "readwrite");
				var objectStore = transaction.objectStore("blog_article_delete_store");

				var data_submit={ id: id };
				var request=objectStore.put(data_submit);				
				
				request.onsuccess = function(event)
				{
					if (navigator.onLine)
					{ 
						$scope.readAllDelete();
						console.log("2");
					}
					else
					{
						console.log("u r offline ur data will be uploaded next time when u will be online");
					}
				}
			}
		}		
    	else
    	{
    		alert("you need to login first");
    	}
	}

	$scope.readAllDelete = function() 
	{
		console.log("4");

		var objectStore = db.transaction("blog_article_delete_store").objectStore("blog_article_delete_store");
		objectStore.openCursor().onsuccess = function(event) 
		{
			var cursor = event.target.result;

			if (cursor) 
			{
				$scope.deleteComments(cursor);

				$http({
			        method: 'POST',
			        url: BASE_URL  + 'index.php/usernew/delete_article' ,
			        headers: { 'Content-Type': 'application/json'  },
			        data:JSON.stringify({ 	"u_id":cursor.value.id })
				})
		  		.success  ( function( data)
	      		{
	      			//sometihng	
	      		})
	      		cursor.continue();
			}
			else
			{
				alert("No more entries!");
				if (navigator.onLine) 
				{
					delete_indexed_delete_data();
				}	
			}
		}	
	}

	function delete_indexed_delete_data()
	{
		var DBOpenRequest = window.indexedDB.open("blog_article_delete_details", 1);

		DBOpenRequest.onsuccess = function(event)
		{
			// store the result of opening the database in the db variable. This is used a lot below
			db = DBOpenRequest.result;

			// Run the clearData() function to clear all the data form the object store
			clearData();
		};

		function clearData() 
		{
			// open a read/write db transaction, ready for clearing the data
			var transaction = db.transaction(["blog_article_delete_store"], "readwrite");

			// report on the success of opening the transaction
			transaction.oncomplete = function(event)
			{
				//console.log("oncomplete");
			};

			transaction.onerror = function(event)
			{
				//console.log("on error");
			};

			// create an object store on the transaction
			var objectStore = transaction.objectStore("blog_article_delete_store");
			// clear all the data out of the object store
			var objectStoreRequest = objectStore.clear();

			objectStoreRequest.onsuccess = function(event)
			{
			// report the success of our clear operation
				$scope.getArticles();
			};
		}
	}

// will run automatically once the delete function has been successfully executed
    $scope.deleteComments = function  ( cursor )
    {
    	id 		= cursor.value.id;
    	console.log("articles_comment");
    	console.log(id);

	    
		$http({
			method: 'POST',
			url: BASE_URL  + 'index.php/usernew/delete_comment' ,
			headers: {'Content-Type': 'application/json'},
			data:JSON.stringify({ "u_id":id })
		})
		.success( function(  data)
		{
			$scope.getArticles();
		});
    }

// get the data u_id and forwarded it to the page where it can be updated
    $scope.getDataForUpdate = function  ( article_detail  )
    {
    	if ($cookies.get('user_name'))
    	{
	    	$scope.abc = "true";
			$location.path (  'update/' + article_detail.u_id);
		}
		else
		{
			alert("you need to login first");
		}
    };
});

//=======================================================================================
// UPDATE HERE CONTROLLER
//=======================================================================================
app.controller (  'updateHereController', function ($scope,$http,$location,$routeParams, $cookies	)
{
	$scope.update = {};
	$scope.uppi = {};
	$scope.uppi.supr_id = $routeParams.uid;

	if (!$cookies.get('user_name'))
		{
			$location.path("usernew/index");
		};

	//console.log($cookies.get('user_name'));
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

	if (!window.indexedDB)
	{
		alert("Sorry!Your browser doesn't support IndexedDB");
	}

	var request = window.indexedDB.open("blog_article_update_details",1);
	var db;

	request.onerror = function(event)
	{
		console.log(event.target.errorCode);
	};

	request.onsuccess = function(event)
	{
		db=request.result;
		console.log("1");
	};

	request.onupgradeneeded = function(event)
	{
		var db = event.target.result;
		var objectStore = db.createObjectStore("blog_article_update_store", { keyPath:  "u_id",autoIncrement:true});
		console.log("3");
	};

	// to get the data thats need to be updated
	$scope.getUpdateForSomething = function(uppi)
	{
		if($cookies.get('user_name'))
		{
			$http
			({
				method: 'POST',	url: BASE_URL+'index.php/usernew/getall' ,	headers: {'Content-Type': 'application/json'},
				data:JSON.stringify({ "u_id":uppi.supr_id })
			})
			.success  ( function( data)
			{
				////console.log("something");
				CKEDITOR.replace( 'blog_article' );
				$scope.update.u_id 				= data.datas[0].u_id;
				$scope.update.blog_writer 		= data.datas[0].writer;
				$scope.update.blog_title 		= data.datas[0].title;

				article							= data.datas[0].article;

				CKEDITOR.instances['blog_article'].setData(article);
			});
		}
	}

	// for updting  the articles details
    $scope.blog_updateForm = function(  update  )
	{
		//$scope.update.article = CKEDITOR.instances.blog_article.getData();
		$scope.update.article = CKEDITOR.instances.blog_article.getData();

		if (	confirm	(	"R U SURE THAT U WANNA UPDATE YOUR DATA!!!"	)	==	true	)
		{
			title 	= $scope.update.blog_title; 
			article = $scope.update.article;
			id 		= $scope.update.u_id;

			var transaction = db.transaction(["blog_article_update_store"], "readwrite");
			var objectStore = transaction.objectStore("blog_article_update_store");

			// 	data:JSON.stringify({	"article":update.article,	"u_id":update.u_id,  "title":update.blog_title	})

			var data_submit={title: title, article: article, id: id };
			var request=objectStore.put(data_submit);
			
			request.onsuccess = function(event)
			{
				CKEDITOR.instances.blog_article.setData();
				$scope.update.blog_title = ""; 
				//$scope.update.article = "";
				$scope.update.u_id = "";
				if (navigator.onLine)
				{ 
					$scope.readAllUpdate();
					console.log("2");
				}
				else
				{
					console.log("u r offline ur data will be uploaded next time when u will be online");
				}
			}
		}
	}

	$scope.readAllUpdate = function() 
	{
		console.log("4");

		//var transaction = db.transaction(["blog_article_store"], "readwrite");
		var objectStore = db.transaction("blog_article_update_store").objectStore("blog_article_update_store");
		objectStore.openCursor().onsuccess = function(event) 
		{
			var cursor = event.target.result;

			if (cursor) 
			{

				$http({
			        method: 'POST',
			        url: BASE_URL  + 'index.php/usernew/update_article' ,
			        headers: { 'Content-Type': 'application/json'  },
			        data:JSON.stringify({ "article":cursor.value.article,	"u_id":cursor.value.id,  "title":cursor.value.title })
				})
		  		.success  ( function( data)
	      		{
	      			//something
	      		})

	      		cursor.continue();
			}
			else
			{
				alert("No more entries!");
				if (navigator.onLine) 
				{
					delete_indexed_update_data();
				}	
			}
		}	
	}

	function delete_indexed_update_data()
	{
		console.log(" update aaya");
		// console.log("aaya");
		var DBOpenRequest = window.indexedDB.open("blog_article_update_details", 1);

		DBOpenRequest.onsuccess = function(event)
		{
			// store the result of opening the database in the db variable. This is used a lot below
			db = DBOpenRequest.result;

			// Run the clearData() function to clear all the data form the object store
			clearData();
		};

		function clearData() 
		{
			// open a read/write db transaction, ready for clearing the data
			var transaction = db.transaction(["blog_article_update_store"], "readwrite");

			// report on the success of opening the transaction
			transaction.oncomplete = function(event)
			{
				console.log("oncomplete");
			};

			transaction.onerror = function(event)
			{
				console.log("on error");
			};

			// create an object store on the transaction
			var objectStore = transaction.objectStore("blog_article_update_store");
			// clear all the data out of the object store
			var objectStoreRequest = objectStore.clear();

			objectStoreRequest.onsuccess = function(event)
			{
			// report the success of our clear operation
				console.log("on success");
			};
		}
	}
});

//=======================================================================================
// COMMENT CONTROLLER
//=======================================================================================
app.controller (  'commentController', function ($scope,$http,$location, $routeParams ,$cookies)
{
	$scope.val = {};
	$scope.read = {};
	$scope.comment = {};
	$scope.val.id = $routeParams.cid;

	if ( !$cookies.get('user_name'))
	{
		$location.path("usernew/index");
	}

	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

	if (!window.indexedDB)
	{
		alert("Sorry!Your browser doesn't support IndexedDB");
	}

	var request = window.indexedDB.open("blog_article_comment_details",1);
	var db;

	request.onerror = function(event)
	{
		console.log(event.target.errorCode);
	};

	request.onsuccess = function(event)
	{
		db=request.result;
		console.log("1");
	};

	request.onupgradeneeded = function(event)
	{
		var db = event.target.result;
		var objectStore = db.createObjectStore("blog_article_comment_store", { keyPath:  "u_id",autoIncrement:true});
		console.log("3");
	};

	// get all the data for which  user gonna comment
	$scope.getall = function( val )
    {
    	$http
		({
			method: 'POST',	url: BASE_URL+'index.php/usernew/getall' ,	headers: {'Content-Type': 'application/json'},
			data:JSON.stringify({ "u_id":val.id })
		})
		.success  ( function( data)
		{
			$scope.comment_writer 		= data.datas[0].writer;
			$scope.comment_title 		= data.datas[0].title;
			$scope.comment_article 		= data.datas[0].article;
			$scope.comment_category 	= data.datas[0].category;
			comment_category 			= data.datas[0].category;

			$scope.comment.sstryId 		= data.datas[0].u_id;
			//alert($scope.comment.sstryId);
			$scope.getrelatedarticles(comment_category);
			$scope.getComments (  val );
		});
    }
	
	// too see the comments and insert the comment it forward to the comment page
	$scope.commenting = function  ( article_detail  )
    {
		$location.path (	'comment/'	+ article_detail.u_id  );
    }

	// it will insert the data and update the comment list
    $scope.showComment = function ( comment )
    {
    	alert("success");
    	console.log(comment);
       	$http
		({
			method: 'POST',	url: BASE_URL+'index.php/usernew/showComment' ,	headers: {'Content-Type': 'application/json'},
			data:JSON.stringify({ "u_id":comment.sstryId })
		})
		.success  ( function ( data)
		{
			$scope.article_comments = data.commented_details;
			$scope.comment_values = true;
		});
    }

	// will show the comments for the desired article at the inital
    $scope.getComments = function(  val)
    {
       	$http
		({
			method: 'POST',	url: BASE_URL+'index.php/usernew/getComments' ,	headers: {'Content-Type': 'application/json'},
			data:JSON.stringify({ "u_id":val.id })
		})
		.success  ( function  ( data)
		{
			$scope.comment_values = true;
			$scope.article_comments = data.com;
		});
    }

	// get the articles that are related to the articles categories user selected
    $scope.getrelatedarticles = function(comment_category)
    {
    	$http
		({
			method: 'POST',	url: BASE_URL+'index.php/usernew/getrelatedarticles' ,	headers: {'Content-Type': 'application/json'},
			data:JSON.stringify({ "categ":comment_category })
		})
		.success  ( function ( data)
		{
			$scope.article_categories = data.categs;
		});
    }



    // this will insert the comments into the database related to the article
	$scope.commentOnArticle = function ( comment )
	{
		// title 	= $scope.comment.comment_title;
		// u_id	= $scope.comment.sstryId;
		// comment = $scope.comment.comment_describtion;

		$http({
				method: 'POST',
		        url: BASE_URL  + 'index.php/usernew/commentOnArticle' ,
		        headers: { 'Content-Type': 'application/json'  },
		        data:JSON.stringify({ "title":comment.comment_title,	"u_id":comment.sstryId,  "comment":comment.comment_describtion })
					})
		  		.success  ( function( data)
	      		{
	      			$scope.showComment( comment );
	      			//alert("success");

	      			// console.log("hqqqqq");
	      			// console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
	      		})
	}
	
	
});