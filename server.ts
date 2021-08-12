#!/usr/bin/env ts-node

import { join, resolve } from 'path';

let root = resolve(join(__dirname, "../../"));

// Use a default port of 5000 unless it's specified in server config
const port = process.env.PORT || 40000;

console.log(`Server root: ${root}`);
console.log(`Listening: http://localhost:${port}`);

import { Server } from 'node-static';
import { createServer } from 'http';

var fileServer = new (Server)(`${root}/dist/www`);

createServer(function (req, res) {
    console.log(`Request: ${req.url}`);
    fileServer.serve(req, res);
}).listen(port);
