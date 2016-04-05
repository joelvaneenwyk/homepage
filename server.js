﻿var express = require('express')
var app = express()

console.log('Root Server Started');

app
.use('/', require('./source/nodejs/server'))
.use('/', require('./source/cowrk/server'))

port = process.env.PORT || 5000;

app.listen(port)