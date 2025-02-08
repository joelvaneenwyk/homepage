import finalHandler from 'finalhandler';
import fs from 'fs';
import { createServer } from 'http';
import { join, dirname } from 'path';
import process from 'process';

// We import this later so that we can get details above first in case there
// are setup issues with Yarn or PNP
import serveStatic from 'serve-static';

function findProjectRoot(startPath: string): string {
    let currentPath = startPath;
    while (currentPath !== dirname(currentPath)) {
        if (fs.existsSync(join(currentPath, 'hugo.toml'))) {
            return currentPath;
        }
        currentPath = dirname(currentPath);
    }
    throw new Error('Could not find hugo.toml in any parent directory');
}

const root = findProjectRoot(__dirname);
const cwd = process.cwd();

// Use a default port unless it's specified in server config
const port = process.env.PORT || 13020;

console.log(`Server root: ${root}`);
console.log(`Current directory: ${cwd}`);

console.log('\n===\nls .\n===\n');
fs.readdirSync(cwd).forEach((file: string) => {
  console.log(file);
});

console.log('\n===\nls .yarn\n===\n');
if (fs.existsSync(join(root, '.yarn'))) {
  fs.readdirSync(join(root, '.yarn')).forEach((file: string) => {
    console.log(file);
  });
}

console.log('\n===\nStarting Server\n===\n');
console.log(`Listening: http://localhost:${port}`);

if (process.argv[2] === '--test') {
  console.log('Simple import test, skipping server.');
} else {
  const serve = serveStatic(`${root}/dist/www`, { index: ['index.html', 'index.htm'] });

  // Create server
  const server = createServer(function onRequest(req, res) {
    serve(req, res, finalHandler(req, res));
  });

  // Listen
  server.listen(port);
}
