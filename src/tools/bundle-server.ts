/**
 * Reads in the server TypeScript and converts it into a JavaScript file and a
 * bundled JavaScript with all dependencies baked in using esbuild.
 */

import { pnpPlugin } from "@yarnpkg/esbuild-plugin-pnp";
import { build, BuildOptions } from "esbuild";
import ts, { CompilerOptions } from "typescript";
import fs from "fs";

let transpileCompilerOptions: CompilerOptions = {
    module: ts.ModuleKind.CommonJS
};

const configFileName = ts.findConfigFile(
    "./",
    ts.sys.fileExists,
    "tsconfig.json"
);
if (configFileName !== undefined) {
    const configFile = ts.readConfigFile(configFileName, ts.sys.readFile);
    const parsedConfigFile = ts.parseJsonConfigFileContent(
        configFile.config,
        ts.sys,
        "./"
    );
    transpileCompilerOptions = parsedConfigFile.options;
}

fs.mkdirSync("./dist/dev", { recursive: true });
const outputServerJavaScriptPath = "./dist/dev/server.js";
const result = ts.transpileModule(
    fs.readFileSync("./src/server/server.ts", "utf8"),
    {
        compilerOptions: transpileCompilerOptions,
        fileName: "./src/server/server.ts"
    }
);
fs.writeFileSync(outputServerJavaScriptPath, result.outputText);
console.log(`Transpiled JavaScript: '${outputServerJavaScriptPath}'`);

if (result.sourceMapText !== undefined) {
    fs.writeFileSync("./dist/dev/server.js.map", result.sourceMapText);
    console.log("Generated map: './dist/dev/server.js.map'");
}

const options: BuildOptions = {
    bundle: true,
    sourcemap: "both",
    format: "cjs",
    target: "node14",
    entryPoints: [outputServerJavaScriptPath],
    outfile: "./dist/server/server.js",
    plugins: [
        pnpPlugin()
    ]
};
console.log(`Generated server bundle: '${options.outfile}'`);

build(options);
