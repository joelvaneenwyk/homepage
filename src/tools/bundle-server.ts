/**
 * Reads in the server TypeScript and converts it into a JavaScript file and a
 * bundled JavaScript with all dependencies baked in using esbuild.
 */

import { build, BuildOptions } from "esbuild";
import ts, { CompilerOptions } from "typescript";
import { readFile, writeFile, mkdir } from "fs/promises";
import { resolve, join } from "path";
import esbuildPluginTsc from "esbuild-plugin-tsc";

async function main() {
    const root = resolve(join(__dirname, "../../"));
    const serverRoot = resolve(join(root, "src", "server"));
    const distRoot = resolve(join(root, "dist"));
    const distOutput = resolve(join(distRoot, "dev"));

    await mkdir(distOutput, { recursive: true });
    const options: BuildOptions = {
        bundle: true,
        platform: "node",
        tsconfig: join(serverRoot, "tsconfig.json"),
        entryPoints: [join(serverRoot, "server.ts")],
        outfile: join(distRoot, "server", "server.js"),
        plugins: [
            esbuildPluginTsc()
        ]
    };

    await build(options);
}

main();
