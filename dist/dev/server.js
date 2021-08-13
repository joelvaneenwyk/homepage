"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const http_1 = require("http");
const fs_1 = __importDefault(require("fs"));
console.log("\n===\nls .\n===\n");
fs_1.default.readdirSync(".").forEach((file) => {
    console.log(file);
});
console.log("\n===\nls .yarn\n===\n");
fs_1.default.readdirSync(".yarn").forEach((file) => {
    console.log(file);
});
console.log("\n===\nStarting Server\n===\n");
const root = path_1.resolve(path_1.join(__dirname, "../../"));
// Use a default port of 5000 unless it's specified in server config
const port = process.env.PORT || 40000;
console.log(`Server root: ${root}`);
console.log(`Listening: http://localhost:${port}`);
// We import this later so that we can get details above first in case there
// are setup issues with Yarn or PNP
const node_static_1 = require("node-static");
const fileServer = new (node_static_1.Server)(`${root}/dist/www`);
if (process.argv[2] === "--test") {
    console.log("Simple import test, skipping server.");
}
else {
    http_1.createServer(function handleRequests(req, res) {
        console.log(`Request: ${req.url}`);
        fileServer.serve(req, res);
    }).listen(port);
}
//# sourceMappingURL=server.js.map