# Web Programming for Console Developers

As a C++ programmer by profession, every few years I look into the web and scoff at it. The tools are usually nowhere near the robustness I'm used to and the level of control I have is just not the same. As a type-safe programmer, Javascript upsets me and the likes of jQuery scare me.

But over time I've come to realize that this is in great part due to my fear of the unknown. Yes, there are parts of web programming that are truly terrible (See [NPM left-pad Chaos](http://www.theregister.co.uk/2016/03/23/npm_left_pad_chaos/)), but it's really coming around at least from my perspective. TypeScript and CoffeeScript exist for those of us that like some degree of type safety. NodeJS for Visual Studio is great and debugging works beautifully. And we have tools like Grunt which provide a 'compile' step for for code cleanup, validation, image optimization and much more.

## Pillars

This is just a side project of mine and as with any side project you need to set some boundaries and goals or you'll never ship anything (something I have ample experience with).

So, I boiled it down to these fundamental goals:

1) Create something that is easy to maintain
2) As easy to deploy live as possible
3) Can test it locally while traveling

## The Stack

### Backend

* Heroku
* NodeJS
* Grunt
* Express
* HARP

### Frontend

* jQuery
* Bootstrap
* SASS
* EJS

### Tools

* Windows 10
* Visual Studio 2015
* Sublime
* Heroku CLI

## Server Setup

Turns out Heroku is pretty great. Up until now I've always had a Linux server somewhere that I manually setup and maintain. Either with a LAMP stack or something similar. It's always a pain to maintain and I need to SFTP or SSH into it to do any work at all. The control was nice, but the issue is that I'm not a web programmer and my day-to-day is actually in Windows or Mac OS which means I'm never really efficient in Linux as much as I'd like to pretend I am.

To satisfy goals 2) and 3) this simply will not work for me. And then I found the servers as a service model like Heroku. The price is relatively competitive with a bit of cost for the convenience.

To deploy, you simply connect it to your GitHub account which allows for private accounts as well. When you submit to GitHub it automatically pulls and builds it. Setup is easy, in the root of your project you define:

* app.json

```
Basic description of your application.
```

* Procfile

```
Command to launch the web server (e.g. node server.js)
```

* package.json

```
This is used by npm to store information about the package. Here you define dependencies, basic information like username and email, and so on.
```

Once you have these defined and a basic NodeJS server

## Postgres

Heroku also has postgres support directly which can be very handy and easy to use connection using pgAdmin III. Details on connecting [using NodeJS][10]:

* [Connecting in NodeJS](https://devcenter.heroku.com/articles/heroku-postgresql#connecting-in-node-js)

Also some details on [Connecting to Postgres](https://devcenter.heroku.com/articles/connecting-to-heroku-postgres-databases-from-outside-of-heroku)

You can get all the details about the server from the stats page in my case something like this:

```
https://postgres.heroku.com/databases/jvaneenwyk-database
```

I ran into the following:

```
connect to PostgreSQL server: FATAL: no pg_hba.conf entry for host "4X.XXX.XX.XXX"
```

Turns out this was because I didn't enable SSL.

```javascript
var pg = require('pg');
pg.defaults.ssl = true;
var client = new pg.Client()
pg.connect(process.env.PG_REMOTE_URL, function(err, client) {
    if (err) {
        console.log('Failed to connect to remote postgres. Connecting to local postgres');
        console.log(err);
        pg.connect(process.env.PG_LOCAL_URL, function(err, client) {
            if (err) {
                console.log('Failed to connect to local postgres');
                console.log(err);
            } else {
                setupDatabase(client);
            }
        });
    } else {
        setupDatabase(client);
    }
});
```

## Other Technology

There are innumerable other technologies I looked at while implementing my website that I haven't even started to have time to look at. You can add unfurl tags (http://tinyurl.com/pu59bre) via oEmbed server or HTML meta tags for Facebook OpenGraph.

For live editing you have StackEdit and Prose.io and numerous others which all seem pretty great, but honestly if you're using GitHub then you can use your favorite desktop app like Sublime in my case.

Cloudpipes is another that caught my eye, but spending money to visually program automated interactions with the world seems a bit strange to me.

## Resources

[1]: https://devcenter.heroku.com/articles/custom-domains
[2]: http://stackoverflow.com/questions/14125175/setup-heroku-and-godaddy
[3]: http://stackoverflow.com/questions/7170664/how-to-configure-heroku-application-dns-to-godaddy-domain
[4]: https://devcenter.heroku.com/articles/ssl-endpoint
[5]: https://support.dnsimple.com/articles/alias-record/
[6]: http://lifesforlearning.com/heroku-with-godaddy/
[7]: https://devcenter.heroku.com/articles/heroku-local#add-a-config-var-to-your-env-file
[8]: https://help.disqus.com/customer/en/portal/articles/2158629
[9]: https://www.godaddy.com/help/manually-forwarding-or-masking-your-domain-name-422
[10]: http://mherman.org/blog/2015/02/12/postgresql-and-nodejs/ "Useful NodeJS and Postgres Tutorial"
