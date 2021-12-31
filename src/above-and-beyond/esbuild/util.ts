import dotenv from "dotenv"

export const makeDefine = () => {
    let env;
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
