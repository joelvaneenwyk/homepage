var express = require('express')
var app = express()

console.log('Root Server Started');

var mode = 'debug'

app
.use('/', require('./source/nodejs/server'))
.use('/', require('./source/cowrk/server'))

var port = 8081;

if (mode == 'heroku')
{
	port = process.env.PORT || 5000;
}

app.listen(port)
