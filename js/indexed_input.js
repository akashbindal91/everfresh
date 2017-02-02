window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

if (!window.indexedDB)
{
    alert("Sorry!Your browser doesn't support IndexedDB");
}

var request = window.indexedDB.open("blog_article_details",1);
var db;
//var request = window.indexedDB.open("blog_article_details",1);

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

// ADING OR UPDATING
var data_submit={title:”Test Note”, article:”Hello World!”, writer:”01/04/2013”, category:”01/04/2013”};
var transaction = db.transaction(["blog_article_store"], "readwrite");
var objectStore = transaction.objectStore("blog_article_store");
var request=objectStore.put(data_submit);
request.onsuccess = function(event)
{
    //do something here
};



function something()
{
	var notes="";
	var objectStore = database.transaction("notes").objectStore("notes");
	objectStore.openCursor().onsuccess = function(event) 
	{
    	var cursor = event.target.result;

    	if (cursor)
    	{
	        var link="<a class="notelist" id=""+cursor.key+"" href="#">"+cursor.value.title+"</a>"+" 
	        <img class="delete" src="delete.png" height="30px" id=""+cursor.key+""/>";
	        var listItem="<li>"+link+"</li>";
	        notes=notes+listItem;
	        cursor.continue();
	    }
	}
}