import {Plugin} from "esbuild"
import dotenv from "dotenv"

export const plugin: () => Plugin = () => {
    return {
        name: "importMap",
        setup(build) {

        }
    };
}


export const makeDefine = () => {
    let env = {} as any;
    if (process.env.NODE_ENV === "production") {
        env = dotenv.config({
            path: ".env.production",
        });
    } else {
        env = dotenv.config();
    }

    const environmentReplacer = {};
    for (const [key, value] of Object.entries(env.parsed ?? {})) {
        environmentReplacer[`process.env.${key}`] = JSON.stringify(value);
    }

    return environmentReplacer
};
