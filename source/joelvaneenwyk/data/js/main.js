//
// Event handlers
//

function log(info) {
    console.log("[JVE] " + info);
}

function onResize() {
    log("Resize event called...");
    updateHeader();
}

function onReady() {
    log("On ready called...");
    updateHeader();
}

var url = '';
var w = '';

$(document).ready(function() {
    $.get('/login', function(data) {
        url = data;
    });

    var interval = window.setInterval((function() {
        if (w.closed) {
            window.clearInterval(interval);
            window.location = '/user';
        }
     }),1000);
});

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail());
}

//
// Global utilities
//

function updateHeader() {
    var height = this.innerHeight / 2;
    var width = this.innerWidth;

    //if (height < 250) height = 250;
    if (width < 100) width = 100;

    // Force the width of the main container to be the width of the window
    $(".container.parent").css('width', width + 'px');
    // Set the top row to be half the page height
    $("div.row.top").css('height', height + 'px');

    // Center the top header row by setting the width and the margin-left offset
    var middleWidth = this.innerWidth;
    if (middleWidth > 550) middleWidth = 550;
    $(".row.header").css('width', middleWidth + 'px');
    $(".row.header.centered").css('margin-left', '-' + (middleWidth / 2) + 'px');
}

$(document).ready(function() {
    onReady();
    jQuery(window).on('resize', onResize);
});
