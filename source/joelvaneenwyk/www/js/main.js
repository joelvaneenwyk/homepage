/*globals $:false */
/*global window: false */
/*global Cookies: false */
/*jslint browser: true */
"use strict";

//
// Google Analytics
//

var WebFontConfig = {
    google: { families: ['Dosis:400,800,600:latin'] }
};

var FontObservers = [
    new FontFaceObserver("Dosis", {
        weight: 400
    }), new FontFaceObserver("Dosis", {
        weight: 600
    }), new FontFaceObserver("Dosis", {
        weight: 800
    })
];

(function() {
    // Get the fonts we need
    var wf = document.createElement('script');
    wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);

    // Load up Google analytics
    (function(i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function() {
            (i[r].q = i[r].q || []).push(arguments);
        }, i[r].l = 1 * new Date();
        a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m);
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

    ga('create', 'UA-63489189-1', 'auto');
    ga('send', 'pageview');
    ga('require', 'autotrack', {
        attributePrefix: 'data-ga-'
    });
})();

//
// Event handlers
//

var loginUrl;
var loginWindow;

(function(w) {}(this));

// Append custom data so that we know it comes from us
function customLog(info) {
    console.log("[JVE] " + info);
}

// This is called explicitly by the user on button press
function startLogin() {
    loginWindow = window.open('/auth/google', "Google Login", 'width=800, height=600');
}

function setUser(user) {
    // Store this in the local storage as well as in cookies
    localStorage.setItem('user', user);
    Cookies.set('user', JSON.stringify(user), { expires: user.expires, path: '' });
}

function getUser() {
    var user = localStorage.getItem('user');
    if (user === undefined) {
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

function fontsLoaded() {
    document.documentElement.className += " fonts-loaded";
    setTimeout(updateHeader, 100);
    console.log('Fonts loaded');
}

function showSuccess(msg) {
    $('#failure_message').hide();
    $('#success_message').html('Success <i class="glyphicon glyphicon-thumbs-up"></i> ' + msg);
    $('#success_message').slideDown({ opacity: "show" }, "slow");
    $('#contact_form').data('bootstrapValidator').resetForm();
}

function showFailure(msg) {
    $('#success_message').hide();
    $('#failure_message').html('Failed <i class="glyphicon glyphicon-thumbs-down"></i> ' + msg);
    $('#failure_message').slideDown({ opacity: "show" }, "slow");
}

function addPasswordValidation() {
    $('#private_form').validator({
            // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            excluded: [':disabled'],
            fields: {
                password: {
                    validators: {
                        stringLength: {
                            min: 8,
                        },
                        notEmpty: {
                            message: 'Please supply password longer than 8 characters'
                        }
                    }
                },
            }
        })
        .on('submit', function(e) {
            // Prevent form submission
            e.preventDefault();

            // Get the form instance
            var $form = $(e.target);

            var data = $form.serializeArray();
            data.push({ name: "page", value: $(this).attr('action') });

            $.ajax({
                url: 'validate',
                type: 'POST',
                data: $.param(data),
                success: function(result) {
                    if (result.authenticated == 'true') {
                        //$('#private_form').validator("resetForm", true);
                        showFailure('Invalid password please try again.');
                    } else {
                        window.location.href = result.redirect;
                    }
                },
                error: function(result) {
                    //$('#private_form').validator("resetForm", true);
                    showFailure('Invalid password please try again.');
                }
            });

            return false;
        });
}

$(document).ready(function() {
    updateHeader();
    $(window).on('resize', updateHeader);

    addPasswordValidation();

    Promise
        .all(FontObservers.map(function(font) {
            return font.load();
        }))
        .then(fontsLoaded);
});
