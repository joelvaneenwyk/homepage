import fs from "fs";
import { createServer } from "http";
import { join, resolve } from "path";
import process from "process";

const root = resolve(join(__dirname, "../../"));
const cwd = process.cwd();

// Use a default port of 5000 unless it's specified in server config
const port = process.env.PORT || 40000;

console.log(`Server root: ${root}`);
console.log(`Current directory: ${cwd}`);

console.log("\n===\nls .\n===\n");
fs.readdirSync(cwd).forEach((file: any) => {
    console.log(file);
});

console.log("\n===\nls .yarn\n===\n");
fs.readdirSync(join(root, ".yarn")).forEach((file: any) => {
    console.log(file);
});

console.log("\n===\nStarting Server\n===\n");
console.log(`Listening: http://localhost:${port}`);

// We import this later so that we can get details above first in case there
// are setup issues with Yarn or PNP
import { Server } from "node-static";

const fileServer = new Server(`${root}/dist/www`);

if (process.argv[2] === "--test") {
    console.log("Simple import test, skipping server.");
} else {
    createServer(function handleRequests(req, res) {
        console.log(`Request: ${req.url}`);
        fileServer.serve(req, res);
    }).listen(port);
}
