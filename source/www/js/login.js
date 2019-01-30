"use strict";

function onLoginSuccess(user) {
	var w = window;
	if (window.opener !== undefined && window.opener.customLog !== undefined)
	{
		w = window.opener;
	}

    w.customLog("On login success!");
    try {
        w.onLogin(user);
    } catch (err) {
        w.customLog("Parent doesn't have onLogin function");
    }
    w.customLog("Closing window");

    if (w !== window)
    	window.close();
}