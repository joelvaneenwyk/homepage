# Dev Notes (Feb 24, 2019)

I decided to refactor my website to make it easier to use and update as well as remove HTTPS support since it was expensive and not really necessary for my needs. In short, huge mistake.

First issue was with [stopping auto-redirect](https://superuser.com/questions/565409/how-to-stop-an-automatic-redirect-from-http-to-https-in-chrome) after disabling HSTS (HTTP Strict Transport Security) and the SSL endpoint. Seems like disabling it should be really straightforward but turns out it really isn't because browsers cache a lot of information and the default age of HSTS is pretty long (60+ days).

* [chrome://net-internals/#hsts](chrome://net-internals/#hsts)
* [How to clear HSTS settings in Chrome and Firefox](https://www.thesslstore.com/blog/clear-hsts-settings-chrome-firefox/)

The other major issue was trying to upgrade packages. The world does not want me to use bower anymore but upgrading my site to use npm or Webpack or whatever is currently the hot new thing takes time and time I don't really want to spend. Just give me the basics please.
