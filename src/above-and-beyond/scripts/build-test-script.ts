import * as util from "./esbuild/util";
import * as esbuild from "esbuild";
import yargs from "yargs-parser";
import path from "path";

const {_, ...argv} = yargs(process.argv.slice(2)) || {};

esbuild.build({
    entryPoints: [
        require.resolve('../e2e/firebase-login.ts'),
    ],
    bundle: true,
    minify: true,
    sourcemap: false,
    // target: ["chrome"],
    outfile: path.join(process.cwd(), "e2e", 'firebase-login.js'),
    platform: "browser",
    define: util.makeDefine(),
    ...argv,
}).catch((e) => {
    console.error(e);
    process.exit(1);
});
