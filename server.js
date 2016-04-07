var express = require('express')
var app = express()

console.log('Root Server Started');


app.use(
    function(req, res, next) {
    	var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        console.log('Request Type: ', fullUrl);
        next();
    });

app
.use('/', require('./source/joelvaneenwyk/server'))
.use('/', require('./source/cowrk/server'))

var expressBeautify = require('express-beautify')(/*Options*/);
app.use(expressBeautify);

port = process.env.PORT || 5000;

console.log('Listing on port: ' + port);

app.listen(port)
