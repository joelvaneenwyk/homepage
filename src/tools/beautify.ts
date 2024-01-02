/**
 * Use 'js-beautify' to pretty up the HTML files.
 */
/**
 * Reads in the server TypeScript and converts it into a JavaScript file and a
 * bundled JavaScript with all dependencies baked in using esbuild.
 */

import fs from "fs";
import { html } from "js-beautify";
import path, { join, resolve } from "path";

function getFiles(directory: fs.PathLike): string[] {
    const files: string[] = [];

    fs.readdirSync(directory).forEach((filename) => {
        const absolutePath = path.resolve(`${directory.toString()}/${filename}`);

        if (fs.statSync(absolutePath).isDirectory()) {
            getFiles(absolutePath).forEach((directoryFilename) => files.push(directoryFilename));
        } else {
            files.push(absolutePath);
        }
    });

    return files;
}

function getRelativePath(inputPath: string): string {
    const absolutePath = path.resolve("./");
    return inputPath.replace(absolutePath, "").replace(/\\/g, "/");
}

function main(): void {
    const root = resolve(join(__dirname, "../../"));
    const distRoot = join(root, "dist");
    const files = getFiles(distRoot);
    files
        .filter((filename) => filename.includes(".html"))
        .forEach((filename) => {
            const data = fs.readFileSync(filename, "utf8");
            const pretty = html(data, {
                indent_size: 2,
                preserve_newlines: false
            });

            if (data !== pretty) {
                fs.writeFileSync(filename, pretty);
                console.log(`Beautified: '${getRelativePath(filename)}'`);
            }
        });

    console.log(`Beautified output files: ${distRoot}`);
}

main();
