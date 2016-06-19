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
    var height = this.innerHeight / 2;
    var width = this.innerWidth;

    //if (height < 250) height = 250;
    if (width < 100) width = 100;

    // Center the top header row by setting the width and the margin-left offset
    var middleWidth = this.innerWidth;
    if (middleWidth > 550) middleWidth = 550;

    // Force the width of the main container to be the width of the window
    $(".container.parent").css('width', width + 'px');
    // Set the top row to be half the page height
    $("div.row.top").css('height', height + 'px');

    $(".row.header").css('width', middleWidth + 'px');
    $(".row.header.centered").css('margin-left', '-' + (middleWidth / 2) + 'px');
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
