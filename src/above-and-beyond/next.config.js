const withMDX = require("@next/mdx")({
    extension: /\.mdx$/,
});

const {PHASE_DEVELOPMENT_SERVER} = require("next/constants");

module.exports = (phase, {defaultConfig}) => withMDX({
    ...defaultConfig,
    pageExtensions: ['page.tsx', 'page.ts', 'api.ts', 'api.tsx'],
    ...(phase === PHASE_DEVELOPMENT_SERVER ? {
        // allow cors for storybook
        async headers() {
            return [
                {
                    // matching all API routes
                    source: "/api/:path*",
                    headers: [
                        {
                            key: "Access-Control-Allow-Credentials",
                            value: "true"
                        },
                        {key: "Access-Control-Allow-Origin", value: "*"},
                        {
                            key: "Access-Control-Allow-Methods",
                            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT"
                        },
                        {
                            key: "Access-Control-Allow-Headers",
                            value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
                        },
                    ]
                }
            ]
        }
    } : {}),
    webpack: (config) => {
        // Important: return the modified config
        config.module.rules.push({
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            use: ['file-loader']
        },)

        return config
    },
    webpack5: true
})
