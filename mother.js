

if (!localStorage["time-to-kill"]) {
   localStorage["time-to-kill"] = 5;
} else {
  localStorage["time-to-kill"] -= 1;
}

if (localStorage["time-to-kill"] == 0) {
   window.location = chrome.extension.getURL("mother.html");
}