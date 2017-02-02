//========================================================================
// not necessary to include just to check wether the prefixes work or not
//========================================================================

// In the following line, you should include the prefixes of implementations you want to test.
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
// DON'T use "var indexedDB = ..." if you're not in a function.
// Moreover, you may need references to some window.IDB* objects:
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
// (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)

//========================================================================
// to check wether indexeddb works on your browser or not
//========================================================================
if (!window.indexedDB)
{
    window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
}

//========================================================================
// open a database
//========================================================================
var request = window.indexedDB.open("DB_NAME", "DB_VERSION");
// "MyTestDatabase" is DB_NAME
// 3 is the  DB_VERSION

//========================================================================
// Creating or updating the version of the database
//========================================================================
request.onupgradeneeded = function(event) 
{ 
	var db = event.target.result;
	// Create an objectStore for this database
	var objectStore = db.createObjectStore("DB_STORE_NAME", { keyPath: "u_id", autoIncrement: true });

	objectStore.createIndex("name", "name", { unique: false });
	objectStore.createIndex("email", "email", { unique: true });

	// Use transaction oncomplete to make sure the objectStore creation is 
	// finished before adding data into it.
	objectStore.transaction.oncomplete = function(event)
	{
		// Store values in the newly created objectStore.
		var customerObjectStore = db.transaction("customers", "readwrite").objectStore("customers");
		for (var i in customerData)
		{
			customerObjectStore.add(customerData[i]);
		};
	}
}

//========================================================================
// ADD DATA
//========================================================================
var transaction = db.transaction(["param 1"], "param 2");
// param1 list of object storesthat transactions will span
// param2 always use "readwrite" over " " or "read"

// Do something when all the data is added to the database.
transaction.oncomplete = function(event) 
{
	alert("All done!");
};

transaction.onerror = function(event) 
{
	// Don't forget to handle errors!
};

var objectStore = transaction.objectStore("customers");
for (var i in customerData) 
{
	var request = objectStore.add(customerData[i]);
	
	request.onsuccess = function(event)
	{
		// event.target.result == customerData[i].ssn;
	};
}

//========================================================================
// REMOVE DATA
//========================================================================
var request = db.transaction(["customers"], "readwrite")
                .objectStore("customers")
                .delete("444-44-4444");
request.onsuccess = function(event)
{
	// It's gone!
};

//========================================================================
// GETTING DATA
//========================================================================
// PART 1 LONG METHOD WITH HANGLING ALL ERRORS
var transaction = db.transaction(["customers"]);
var objectStore = transaction.objectStore("customers");
var request = objectStore.get("444-44-4444");
request.onerror = function(event) {
  // Handle errors!
};
request.onsuccess = function(event) {
  // Do something with the request.result!
  alert("Name for SSN 444-44-4444 is " + request.result.name);
};


// PART 2 IF ALL REQUESTS ARE HANDLED AT DATABASE LEVEL
db.transaction("customers").objectStore("customers").get("444-44-4444").onsuccess = function(event)
{
	alert("Name for SSN 444-44-4444 is " + event.target.result.name);
};

//========================================================================
// UPDATING DATA
//========================================================================
var objectStore = db.transaction(["customers"], "readwrite").objectStore("customers");
var request = objectStore.get("444-44-4444");
request.onerror = function(event) {
  // Handle errors!
};
request.onsuccess = function(event) {
  // Get the old value that we want to update
  var data = event.target.result;
  
  // update the value(s) in the object that you want to change
  data.age = 42;

  // Put this updated object back into the database.
  var requestUpdate = objectStore.put(data);
   requestUpdate.onerror = function(event) {
     // Do something with the error
   };
   requestUpdate.onsuccess = function(event) {
     // Success - the data is updated!
   };
};

//========================================================================
// USING CURSOR
//========================================================================
// PART 1
var objectStore = db.transaction("customers").objectStore("customers");

objectStore.openCursor().onsuccess = function(event) {
  var cursor = event.target.result;
  if (cursor) {
    alert("Name for SSN " + cursor.key + " is " + cursor.value.name);
    cursor.continue();
  }
  else {
    alert("No more entries!");
  }
};

// PART 2
var customers = [];

objectStore.openCursor().onsuccess = function(event) {
  var cursor = event.target.result;
  if (cursor) {
    customers.push(cursor.value);
    cursor.continue();
  }
  else {
    alert("Got all customers: " + customers);
  }
};