var timed_out = true;
var reason = "";

var map_tab_list = function (func) {
    return function(list) {
        for(var i = 0; i<list.length; i++){
            func(list[i].id);
        }
    };
};

var for_all_tabs = function (func) {
     chrome.tabs.query({url:"http://*/*"}, map_tab_list(func));
     chrome.tabs.query({url:"https://*/*"}, map_tab_list(func));
}

var success_dialog = function(tab) {
    chrome.tabs.executeScript(tab, 
        {code: "$('#guilt_success_dialog').dialog('open');"});
};

var borrow_dialog = function(tab) {
    alert(tab);
    chrome.tabs.executeScript(tab, 
        {code: "$('#guilt_borrow_dialog').dialog('open');"});
};


setInterval(function () {
                     alert("time");
                     for_all_tabs(borrow_dialog)
}, 5000);

