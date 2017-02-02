function delete_indexed_data()
{
	var DBOpenRequest = window.indexedDB.open("blog_article_details", 1);

	DBOpenRequest.onsuccess = function(event)
	{
		//note.innerHTML += '<li>Database initialised.</li>';

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
			alert("oncomplete");
			//note.innerHTML += '<li>Transaction completed: database modification finished.</li>';
		};

		transaction.onerror = function(event)
		{
			alert("on error");
			//note.innerHTML += '<li>Transaction not opened due to error: ' + transaction.error + '</li>';
		};

		// create an object store on the transaction
		var objectStore = transaction.objectStore("blog_article_store");
		// clear all the data out of the object store
		var objectStoreRequest = objectStore.clear();

		objectStoreRequest.onsuccess = function(event)
		{
		// report the success of our clear operation
			alert("on success");
		};
	};
}