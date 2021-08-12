import { join, resolve } from "path";

import { Server } from "node-static";
import { createServer } from "http";

const root = resolve(join(__dirname, "../../"));

// Use a default port of 5000 unless it's specified in server config
const port = process.env.PORT || 40000;

console.log(`Server root: ${root}`);
console.log(`Listening: http://localhost:${port}`);

const fileServer = new (Server)(`${root}/dist/www`);

if (process.argv[2] === "--test") {
    console.log("Simple import test, skipping server.");
} else {
    createServer(function handleRequests(req, res) {
        console.log(`Request: ${req.url}`);
        fileServer.serve(req, res);
    }).listen(port);
}
