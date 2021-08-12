import { pnpPlugin } from "@yarnpkg/esbuild-plugin-pnp";
import { build } from "esbuild";

build({
    bundle: true,
    sourcemap: "both",
    format: "cjs",
    target: "node14",
    entryPoints: ["./dist/dev/server.js"],
    outfile: "./dist/server/server.js",
    plugins: [
        pnpPlugin()
    ]
});
