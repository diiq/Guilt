$("body").append("<div id=\"guilt_success_dialog\" title=\"Guilt: Success\"><p>Did you get what you needed?</p></div>");

$("body").append("<div id=\"guilt_borrow_dialog\" title=\"Guilt\"><div id='guilt_reasons'></div><p><strong>Oh, you'd like to borrow the Internet?</strong></p><p>What will you be using it for?</p><input class='ui-corner-all' type='text' id='guilt_reason'></input><p>And when, pray tell, will you be bringing it back?<p></div>");

var x_style = "block";  //TODO enclose
var hide_x = function () {
    x_style = $(".ui-dialog-titlebar-close").css("display");
    $(".ui-dialog-titlebar-close").css("display", "none");
}

var show_x = function () {
    $(".ui-dialog-titlebar-close").css("display", x_style);
}

var htmlize_reasons = function (reasons) {
    return "<ul><li>" + reasons.join("</li><li>") + "</li></ul>";
}

$('#guilt_success_dialog').dialog({
    modal: true,
	autoOpen: false,
	width: 600,
    closeOnEscape: false,
    position: ["center", 100],
    open: hide_x, // These hide the close X without permenantly interfering with the 
    close: show_x, // styling of the page underneath.
	buttons: {
		"Yes, Mission Accomplished.": function() {
            // send "success" message and close tabs.
		},
		"No. Damn.": function() {
			$(this).dialog("close");
			$('#guilt_borrow_dialog').dialog("open");
		}
	},
});

$('#guilt_borrow_dialog').dialog({
    modal: true,
	autoOpen: false,
	width: 600,
	closeOnEscape: false,
    position: ["center", 100],
    open: hide_x,
    close: show_x,
    buttons: {
		"5 minutes.": function() {
            chrome.extension.sendMessage({time:5, reason:$("#guilt_reason").val()});
		},
		"15 minutes": function() {
            chrome.extension.sendMessage({time:15, reason:$("#guilt_reason").val()});
		}
	}
});


// send "new page" message
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
      if (request.dialog) {
          $('#guilt_'+request.dialog+'_dialog').dialog(request.action);
      }
      if (request.action === "open") {
         $("#guilt_reasons").html(htmlize_reasons(request.reasons));
      }
  });


chrome.extension.sendMessage({e:"new_page"});



var modal = (function(){
    var 
    method = {},
    overlay = $('<div id="guilt_overlay"></div>');
    modal = $('<div id="guilt_modal"><div id="guilt_content"></div></div>');
    content = $('');

    modal.hide();
    overlay.hide();
    modal.append(content);

    $('body').append(overlay, modal);

    method.center = function () {
        var top, left;

        top = Math.max($(window).height() - modal.outerHeight(), 0) / 2;
        left = Math.max($(window).width() - modal.outerWidth(), 0) / 2;

        modal.css({
            top:top + $(window).scrollTop(), 
            left:left + $(window).scrollLeft()
        });
    };

    method.open = function (settings) {
        method.center();

        $(window).bind('resize.modal', method.center);

        modal.show();
        overlay.show();
    };

    method.close = function () {
        modal.hide();
        overlay.hide();
        (window).unbind('resize.modal');
    };

    return method;
}());
