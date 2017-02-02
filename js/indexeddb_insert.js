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
	console.log("1");
};

request.onupgradeneeded = function(event)
{
    var db = event.target.result;
    var objectStore = db.createObjectStore("blog_article_store", { keyPath:  "u_id",autoIncrement:true});
    console.log("3");
};


var transaction = db.transaction(["blog_article_store"], "readwrite");
var objectStore = transaction.objectStore("blog_article_store");

var data_submit = { title: title, article: article, writer: writer, category: category };
var request = objectStore.put( data_submit );

request.onsuccess = function(event)
{
	if ( navigator.onLine )
	{ 
		$scope.readAll();
		console.log("2");
	}
	else
	{
		console.log("u r offline ur data will be uploaded next time when u will be online");
	}
}