console.log('TESTING');
// Listening to messages page
chrome.extension.onConnect.addListener(function(port) {
    alert('ON CONNECT');
    port.onMessage.addListener(function(domainUrl) {
        console.log("message recieved: " + domainUrl);
        chrome.cookies.getAll({ 'domain' : domainUrl }, function(cookie){ 
            cookie.forEach(obj => {
                if(obj.name == "sid"){
                    port.postMessage('Hii'+obj.value);
                }
            }); 
        }); 
    });
 });

 chrome.browserAction.onClicked.addListener(function(tab) {
    console.log('NEW TAB');
    var url1 = "https://stackoverflow.com/";
    chrome.tabs.create({'url': chrome.extension.getURL('/index.html'), 'selected': true, 'active': true});
   
});

  