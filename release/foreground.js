var modal = (function(){
    var 
    method = {},
    overlay = $('<div id="guilt_overlay"></div>'),
    modal = $('<div id="guilt_modal"></div>');

    modal.hide();
    overlay.hide();

    method.center = function () {
        var top, left;

        top = 100;
        left = Math.max($(window).width() - modal.outerWidth(), 0) / 2;

        modal.css({
            top:top,
            left:left
        });
    };

    method.open = function (settings) {
        $('body').append(overlay, modal);
        
        modal.append(settings.content);
        settings.content.show();

        method.center();
        setTimeout(method.center, 100);
        $(window).bind('resize.modal', method.center);


        modal.show();
        overlay.show();
    };

    method.close = function () {
        modal.hide();
        $("body").append(modal.contents())
        modal.remove();
        overlay.hide();
        overlay.remove();
        $(window).unbind('resize.modal');
    };

    return method;
}());

var get_time = function (time) {
    return function () {
        if ($("#guilt_reason_input").val() === "") {
            $("#guilt_reason_input").css("border-color", "#f00");
        } else {
            chrome.extension.sendMessage({time:time, reason:$("#guilt_reason_input").val()});
            $("#guilt_reason_input").css("border-color", "#cbe86b");
        }
    }
}

success_content = $('<div id="guilt_success"><div id="guilt_query"><img id="guilt_the_job"><div class="guilt_button guilt_right_button" id="guilt_failure_button">No.</div><div class="guilt_button" id="guilt_success_button">Yes!</div></div></div>').hide();
$("body").append(success_content);


borrow_content = $('<div id="guilt_borrow"><div id="guilt_query"><img id="guilt_for_what"><input type="text" id="guilt_reason_input"></input><img id="guilt_how_long"><div class="guilt_button guilt_right_button" id="guilt_15_button">15 min</div><div class="guilt_button" id="guilt_5_button">5 min</div></div><div id="guilt_reasons"><img id="guilt_recent"><div id="guilt_reasons_list"></div></div></div>').hide();
$("body").append(borrow_content);

$("#guilt_for_what").attr('src', chrome.extension.getURL("for_what.png"));
$("#guilt_how_long").attr('src', chrome.extension.getURL("how_long.png"));
$("#guilt_recent").attr('src', chrome.extension.getURL("recent.png"));
$("#guilt_the_job").attr('src', chrome.extension.getURL("the_job.png"));

$("#guilt_reason_input").width(240);
$("#guilt_reason_input").keypress(function (e) {
    if ( e.which == 13 ) $("#guilt_5_button").click();
});

$("#guilt_5_button").click(get_time(5));
$("#guilt_15_button").click(get_time(15));
$("#guilt_failure_button").click(function() {
    modal.close();
    modal.open({content:$("#guilt_borrow")});
    $('#guilt_reason_input').focus();
});

$("#guilt_success_button").click(function() {
    chrome.extension.sendMessage({success:true});    //close all tabs message.
});


var htmlize_reasons = function (reasons) {
    return "<ul><li>" + reasons.join("</li><li>") + "</li></ul>";
}

// send "new page" message
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
      if (request.dialog && request.action === "open") {
          modal.open({content:$('#guilt_'+request.dialog)});
          $("#guilt_reasons_list").html(htmlize_reasons(request.reasons));
          if (request.dialog === "borrow") {
              $('#guilt_reason_input').focus();
          }
      }
      if (request.dialog && request.action === "close") {
          modal.close();
      }

  });


chrome.extension.sendMessage({e:"new_page"});


