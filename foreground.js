$("body").append("<div id=\"guilt_success_dialog\" title=\"Guilt: Success\"><p>Did you accomplish thing?</p></div>");

$("body").append("<div id=\"guilt_borrow_dialog\" title=\"Guilt: Oh, You'd like to borrow the Internet?\"><p>What for></p><input type=\"text\"></input>For how long?</div>");


$('#guilt_success_dialog').dialog({
    modal: true,
	autoOpen: false,
	width: 600,
	buttons: {
		"Yes, Mission Accomplished.": function() {
            // send "success" message and close tabs.
		},
		"No. Damn.": function() {
			$(this).dialog("close");
			$('#guilt_borrow_dialog').dialog("open");
		}
	}
});

$('#guilt_borrow_dialog').dialog({
    modal: true,
	autoOpen: false,
	width: 600,
	buttons: {
		"5 minutes.": function() {
            // check for reason,
            // send "time" message.
		},
		"15 minutes": function() {
            // Check for reason.
            // send "time" message.  
		}
	}
});

// send "new page" message

