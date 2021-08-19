/**
 * Use 'js-beautify' to pretty up the HTML files.
 */

import { html } from "js-beautify";
import fs from "fs";
import path from "path";

function getFiles(directory: fs.PathLike) {
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

function getRelativePath(inputPath: string) {
    const absolutePath = path.resolve("./");
    return inputPath.replace(absolutePath, "").replace(/\\/g, "/");
}

const files = getFiles("./dist/");
files.filter((filename) => filename.includes(".html")).forEach((filename) => {
    const data = fs.readFileSync(filename, "utf8");
    const pretty = html(
        data,
        {
            indent_size: 2,
            preserve_newlines: false
        }
    );

    if (data !== pretty) {
        fs.writeFileSync(filename, pretty);
        console.log(`Beautified: '${getRelativePath(filename)}'`);
    }
});
