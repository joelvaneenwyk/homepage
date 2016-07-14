/*globals $:false */
/*global window: false */
/*global Cookies: false */
/*jslint browser: true */
"use strict";

//
// Event handlers
//


var loginUrl;
var loginWindow;

// Append custom data so that we know it comes from us
function customLog(info) {
    console.log("[JVE] " + info);
}

// This is called explicitly by the user on button press
function startLogin() {
    loginWindow = window.open(loginUrl, "Google Login", 'width=800, height=600');
}

function setUser(user) {
    // Store this in the local storage as well as in cookies
    localStorage.setItem('user', user);
    Cookies.set('user', JSON.stringify(user), { expires: user.expires, path: '' });
}

function getUser() {
    var user = localStorage.getItem('user');
    if (user === undefined)
    {
        user = Cookies.get('user');
    }
    return user;
}

// Called by login script externally
function onLogin(user) {
    customLog('Authentication called. User data: ' + JSON.stringify(user));
    setUser(user);
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
        customLog('Retrieved Google login URL');
    });

    updateHeader();
    $(window).on('resize', updateHeader);
});
