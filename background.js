var hide = function (list) {
    for(var i = 0; i<list.length; i++){
         chrome.tabs.executeScript(list[i].id, 
             {file: "mother.js"});
    }
}

setInterval(function () {
     chrome.tabs.query({url:"http://*/*"}, hide);
     chrome.tabs.query({url:"https://*/*"}, hide);
}, 5000);

