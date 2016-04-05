var express = require('express')
var app = express()

console.log('Root Server Started');

app
.use('/', require('./source/joelvaneenwyk/server'))
.use('/', require('./source/cowrk/server'))

port = process.env.PORT || 5000;

console.log('Listing on port: ' + port);

app.listen(port)
