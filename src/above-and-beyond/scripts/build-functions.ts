import * as util from "./esbuild/util";
import * as esbuild from "esbuild";
import yargs from "yargs-parser";
import path from "path";

const {_, ...argv} = yargs(process.argv.slice(2)) || {};
const root = process.cwd()
esbuild.build({
    entryPoints: [
        path.join(root, 'seed', 'functions.ts')
    ],
    bundle: true,
    format: "cjs",
    minify: true,
    sourcemap: false,
    external: ['firebase-functions', 'firebase-admin'],
    outfile: path.join(root, ".docker", 'firebase', 'functions', 'index.js'),
    platform: "node",
    define: util.makeDefine(),
    ...argv,
}).catch((e) => {
    console.error(e);
    process.exit(1);
});
