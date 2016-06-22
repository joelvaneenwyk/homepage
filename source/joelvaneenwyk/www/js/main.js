//
// Event handlers
//

function log(info) {
    console.log("[JVE] " + info);
}

var loginUrl = '';
var loginWindow = '';

function startLogin() {
    loginWindow = window.open(loginUrl, "Google Login", 'width=800, height=600');
}

//
// Global utilities
//

function updateHeader() {
    var height = Math.max( $(window).height() / 2, $("#bottom-align").height() );
    var timeToDestination = 250;
    $("#top-header").clearQueue();
    $("#top-header").animate({ "height": height + 'px' }, {
        duration: timeToDestination,
        easing: "swing" });

    $("#bottom-align").clearQueue();
    $("#bottom-align").animate({ "margin-top": height - $("#bottom-align").height() + 'px' }, {
        duration: timeToDestination,
        easing: "swing" });
}

$(document).ready(function() {
    $.get('/login', function(data) {
        loginUrl = data;
    });

    // This forces you to the user page if it logs in
    var interval = window.setInterval((function() {
        if (loginWindow.closed) {
            window.clearInterval(interval);
            window.location = '/';
        }
    }), 500);

    updateHeader();
    jQuery(window).on('resize', updateHeader);
});
