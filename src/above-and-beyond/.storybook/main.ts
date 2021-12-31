import {Configuration, DefinePlugin} from "webpack";
import path from "path";

export interface MainOpts {
    stories: string;
    jsxToJS?: RegExp;
}

const toPath = (_path) => path.join(process.cwd(), _path);

export default {
    features: {
        emotionAlias: false,
    },
    babel: (options) => {
        // https://github.com/storybookjs/storybook/issues/13834#issuecomment-880646396
        options.presets.push("@emotion/babel-preset-css-prop")
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

        // Emotion 11
        base.resolve.alias = {
            ...base.resolve.alias,
            '@emotion/core': toPath('node_modules/@emotion/react'),
            '@emotion/styled/base': toPath('node_modules/@emotion/styled'),
            '@emotion/styled': toPath('node_modules/@emotion/styled'),
            'emotion-theming': toPath('node_modules/@emotion/react'),
        };

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
