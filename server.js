var express = require('express')
var app = express()

console.log('Root Server Started');

app
    .use(
        function(req, res, next) {
            var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
            console.log('Request URL: ', fullUrl);
            next();
        })
    .use('/', require('./source/joelvaneenwyk/server'))
    .use('/', require('./source/cowrk/server'))
    .use(function(req, res) {
        res.status(400);
        res.render('404.ejs', { title: '404: File Not Found' });
    })
    .use(function(error, req, res, next) {
        res.status(500);
        res.render('500.ejs', { title: '500: Internal Server Error', error: error });
    });

port = process.env.PORT || 5000;

console.log('Listing on port: ' + port);
app.listen(port);
