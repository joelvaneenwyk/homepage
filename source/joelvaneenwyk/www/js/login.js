/*jslint node: true */
"use strict";

function onLoginSuccess(user) {
    window.opener.console.log("On login success!");
    try {
        window.opener.onLogin(user);
    } catch (err) {
        console.log("Parent doesn't have onLogin function");
    }
    console.log("Closing window");
    window.close();
}