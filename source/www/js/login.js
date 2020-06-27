/*
* Functions to handle logins on the frontend e.g. when a successful login
* to Google is copmleted.
*/
function onLoginSuccess(user) {
    let w = window;
    if (window.opener !== undefined && window.opener.customLog !== undefined) {
        w = window.opener;
    }

    w.customLog("On login success!");
    try {
        w.onLogin(user);
    } catch (err) {
        w.customLog("Parent doesn't have onLogin function");
    }
    w.customLog("Closing window");

    if (w !== window) { window.close(); }
}
