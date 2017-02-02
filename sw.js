self.addEventListener (  "install", function (  event )
{
  //console.log("yeee");
  // creates the cache name in which we need to store the data
  event.waitUntil(  caches.open("its_our_data").then(  function ( cache )
  {
    cache.addAll(
    [
    // locations of the pages that need to be showed
      'application/views/signup.html',
      'application/views/articles.html',
      'application/views/comment.html',
      'application/views/homepage.html',
      'application/views/insert.html',
      'application/views/login.html',
      // 'application/views/update_here.html',
      'application/views/update.html',
      'js/scriptNew.js',
    ])
  })
  )
})

// activating the service worker
self.addEventListener('activate', function(event){
    console.log('activated!');
});

//=================================================================
//=============================================================
// fetching the data from the service worker
self.addEventListener('fetch', function (event) 
{
//respon to event
 event.respondWith(
// if the links in the caches matches the links fired and if it succeed
  caches.match(event.request).then(function (resp) 
  {
    // retrurn resp 
    //or 
    //fetch the requests and if its successfully fetched
    return resp || fetch(event.request).then(function (response)
    {
      // return the data thats belongs to the links thats present insie our caches
      return caches.open("its_our_data").then(function (cache)
      {
        // open the caches and create a recoverry 
        cache.put(event.request, response.clone());
      })
     })
  })
 )
})