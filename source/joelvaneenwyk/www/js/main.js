//
// Event handlers
//

function log(info) {
    console.log("[JVE] " + info);
}

var loginUrl = '';
var loginWindow = '';
var currentUser = undefined;

function startLogin() {
    loginWindow = window.open(loginUrl, "Google Login", 'width=800, height=600');
}

function onLogin(user) {
    log('Authentication called. User data: ' + JSON.stringify(user));
    currentUser = user;
}

//
// Global utilities
//

function updateHeader() {
    var height = Math.max($(window).height() / 2, $("#bottom-align").height());
    var timeToDestination = 250;
    $("#top-header").clearQueue();
    $("#top-header").animate({ "height": height + 'px' }, {
        duration: timeToDestination,
        easing: "swing"
    });

    $("#bottom-align").clearQueue();
    $("#bottom-align").animate({ "margin-top": height - $("#bottom-align").height() + 'px' }, {
        duration: timeToDestination,
        easing: "swing"
    });
}

$(document).ready(function() {
    $.get('/login', function(data) {
        loginUrl = data;
        log('Retrieved Google login URL');
    });

    updateHeader();
    jQuery(window).on('resize', updateHeader);
});
