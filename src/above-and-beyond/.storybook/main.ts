import {Configuration, DefinePlugin} from "webpack";

export interface MainOpts {
    stories: string;
    jsxToJS?: RegExp;
}

export default {
    babel: (options) => {
        // https://github.com/storybookjs/storybook/issues/13834#issuecomment-880646396
        return {
            ...options,
            plugins: options.plugins.filter(
                (x) =>
                    !(
                        typeof x === "string" &&
                        x.includes("plugin-transform-classes")
                    )
            ),
        };
    },
    webpackFinal: async (base: Configuration) => {
        base.module.rules.push({
            test: /\.mdx?$/,
            use: [
                {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react",
                        ],
                    },
                },
                "@mdx-js/loader",
            ],
        });
        const env = require("dotenv").config();
        const definitions = {};
        for (const [key, value] of Object.entries(env?.parsed)) {
            definitions[key] = JSON.stringify(value);
        }
        base.plugins.push(new DefinePlugin(definitions));

        return base;
    },
    stories: ["../pages/**/*.stories.tsx"],
    addons: [
        "@storybook/addon-actions/register",
        "@storybook/addon-viewport/register",
        "storybook-addon-next-router",
    ],
}
