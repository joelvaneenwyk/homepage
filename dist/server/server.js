#!/usr/bin/env ts-node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
let root = path_1.resolve(path_1.join(__dirname, "../../"));
// Use a default port of 5000 unless it's specified in server config
const port = process.env.PORT || 40000;
console.log(`Server root: ${root}`);
console.log(`Listening: http://localhost:${port}`);
const node_static_1 = require("node-static");
const http_1 = require("http");
var fileServer = new (node_static_1.Server)(`${root}/dist/www`);
http_1.createServer(function (req, res) {
    console.log(`Request: ${req.url}`);
    fileServer.serve(req, res);
}).listen(port);
//# sourceMappingURL=server.js.map