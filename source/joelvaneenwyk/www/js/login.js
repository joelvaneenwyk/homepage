"use strict";

function onLoginSuccess(user) {
    window.opener.customLog("On login success!");
    try {
        window.opener.onLogin(user);
    } catch (err) {
        window.opener.console.log("Parent doesn't have onLogin function");
    }
    window.opener.customLog("Closing window");
    window.close();
}