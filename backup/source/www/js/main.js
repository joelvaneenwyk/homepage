/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* global Cookies: false */
/* jslint browser: true */

//
// Google Analytics
//

const WebFontConfig = {
    google: { families: ["Dosis:400,800,600:latin"] }
};

const FontObservers = [
    new FontFaceObserver("Dosis", {
        weight: 400
    }), new FontFaceObserver("Dosis", {
        weight: 600
    }), new FontFaceObserver("Dosis", {
        weight: 800
    })
];

(function () {
    // Get the fonts we need
    const wf = document.createElement("script");
    wf.src = "https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js";
    wf.type = "text/javascript";
    wf.async = "true";
    const s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(wf, s);

    // Load up Google analytics
    // eslint-disable-next-line func-names, no-shadow
    (function (i, s, o, g, r, a, m) {
        // eslint-disable-next-line no-param-reassign
        i.GoogleAnalyticsObject = r;
        // eslint-disable-next-line func-names, no-unused-expressions, no-param-reassign
        i[r] = i[r] || function () {
            // eslint-disable-next-line func-names, no-unused-expressions, no-param-reassign, prefer-rest-params
            (i[r].q = i[r].q || []).push(arguments);
            // eslint-disable-next-line no-sequences, no-param-reassign
        }, i[r].l = 1 * new Date();
        // eslint-disable-next-line no-sequences, no-param-reassign, no-unused-expressions
        a = s.createElement(o),
        // eslint-disable-next-line no-sequences, no-param-reassign, no-unused-expressions, prefer-destructuring
        m = s.getElementsByTagName(o)[0];
        // eslint-disable-next-line no-sequences, no-param-reassign, no-unused-expressions
        a.async = 1;
        // eslint-disable-next-line no-sequences, no-param-reassign, no-unused-expressions
        a.src = g;
        m.parentNode.insertBefore(a, m);
    }(window, document, "script", "//www.google-analytics.com/analytics.js", "ga"));

    ga("create", "UA-63489189-1", "auto");
    ga("send", "pageview");
    ga("require", "autotrack", {
        attributePrefix: "data-ga-"
    });
}());

//
// Event handlers
//

let loginUrl;
let loginWindow;

// Append custom data so that we know it comes from us
function customLog(info) {
    // @if NODE_ENV!='production'
    console.log(`[JVE] ${info}`);
    // @endif
}

// This is called explicitly by the user on button press
function startLogin() {
    loginWindow = window.open("/auth/google", "Google Login", "width=800, height=600");
}

function setUser(user) {
    // Store this in the local storage as well as in cookies
    localStorage.setItem("user", user);
    Cookies.set("user", JSON.stringify(user), { expires: user.expires, path: "" });
}

function getUser() {
    let user = localStorage.getItem("user");
    if (user === undefined) {
        user = Cookies.get("user");
    }
    return user;
}

// Called by login script externally
function onLogin(user) {
    customLog(`Authentication called. User data: ${JSON.stringify(user)}`);
    setUser(user);
    window.location.reload();
}

//
// Global utilities
//

function updateHeader() {
    const height = Math.max(($(window).height() - $("#parent").position().top) / 2, $("#bottom-align").height());
    const timeToDestination = 250;
    $("#top-header").clearQueue();
    $("#top-header").animate({ height: `${height}px` }, {
        duration: timeToDestination,
        easing: "swing"
    });

    $("#bottom-align").clearQueue();
    $("#bottom-align").animate({ "margin-top": `${height - $("#bottom-align").height()}px` }, {
        duration: timeToDestination,
        easing: "swing"
    });
}

function fontsLoaded() {
    document.documentElement.className += " fonts-loaded";
    setTimeout(updateHeader, 100);
    customLog("Fonts loaded");
}

function showSuccess(msg) {
    $("#failure_message").hide();
    $("#success_message").html(`Success <i class="glyphicon glyphicon-thumbs-up"></i> ${msg}`);
    $("#success_message").slideDown({ opacity: "show" }, "slow");
    $("#contact_form").data("bootstrapValidator").resetForm();
}

function showFailure(msg) {
    $("#success_message").hide();
    $("#failure_message").html(`Failed <i class="glyphicon glyphicon-thumbs-down"></i> ${msg}`);
    $("#failure_message").slideDown({ opacity: "show" }, "slow");
}

function addPasswordValidation() {
    $("#private_form").validator({
    // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: "glyphicon glyphicon-ok",
            invalid: "glyphicon glyphicon-remove",
            validating: "glyphicon glyphicon-refresh"
        },
        excluded: [":disabled"],
        fields: {
            password: {
                validators: {
                    stringLength: {
                        min: 8
                    },
                    notEmpty: {
                        message: "Please supply password longer than 8 characters"
                    }
                }
            }
        }
    })
        .on("submit", function (e) {
            // Prevent form submission
            e.preventDefault();

            // Get the form instance
            const $form = $(e.target);

            const data = $form.serializeArray();
            data.push({ name: "page", value: $(this).attr("action") });

            $.ajax({
                url: "validate",
                type: "POST",
                data: $.param(data),
                success(result) {
                    if (result.authenticated === "true") {
                        // $('#private_form').validator("resetForm", true);
                        showFailure("Invalid password please try again.");
                    } else {
                        window.location.href = result.redirect;
                    }
                },
                error(result) {
                    // $('#private_form').validator("resetForm", true);
                    showFailure("Invalid password please try again.");
                }
            });

            return false;
        });
}

$(document).ready(() => {
    updateHeader();
    $(window).on("resize", updateHeader);

    $("[data-toggle=\"tooltip\"]").tooltip();

    addPasswordValidation();

    Promise
        .all(FontObservers.map((font) => font.load()))
        .then(fontsLoaded);
});
