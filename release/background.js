var timed_out = true;
var MAXREASONS = 50;
//localStorage["reasons"] = null;
var reasons = [];//localStorage["reasons"] ? $.parseJSON(localStorage["reasons"]) : [];

var load_reasons = function () {
    if (localStorage["save"] === "true") {
        reasons = localStorage["reasons"].split(",,,")
    }
}

load_reasons();

var save_reasons = function () {
    localStorage["save"] = "true";
    localStorage["reasons"] = reasons.join(",,,");
}

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

var send_all_tabs = function (msg) {
    for_all_tabs(function (tab) {
        chrome.tabs.sendMessage(tab, msg);
    });
};


chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
      if (request.e === "new_page" && timed_out) {
          chrome.tabs.sendMessage(sender.tab.id, 
              {dialog:"borrow", action:"open", reasons:reasons});
      } else if (request.time) {
          reasons.unshift(request.reason);
          if (reasons.length > MAXREASONS) reasons.pop();
          save_reasons();
          timed_out = false;

          send_all_tabs({dialog:"borrow", action:"close"});
          send_all_tabs({dialog:"success", action:"close"});

          setTimeout(function () {
              timed_out = true;
              send_all_tabs({dialog:"success", action:"open", reasons:reasons});
          }, request.time*60000)
      } else if (request.success) {
          chrome.tabs.create({});
          for_all_tabs(function(tab){chrome.tabs.remove(tab)});
      }
  });


