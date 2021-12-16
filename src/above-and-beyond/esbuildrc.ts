import * as util from "./esbuild/util";
import * as esbuild from "esbuild";
import yargs from "yargs-parser";
import path from "path";

const {_, ...argv} = yargs(process.argv.slice(2)) || {};

esbuild.build({
    entryPoints: [
        path.join(__dirname, 'seed', 'functions.ts')
    ],
    bundle: true,
    format: "cjs",
    minify: true,
    sourcemap: false,
    external: ['firebase-functions', 'firebase-admin'],
    // target: ["chrome"],
    // plugins: [util.plugin()],
    outfile: path.join(__dirname, ".docker", 'firebase', 'functions', 'index.js'),
    platform: "node",
    define: util.makeDefine(),
    ...argv,
}).catch((e) => {
    console.error(e);
    process.exit(1);
});
