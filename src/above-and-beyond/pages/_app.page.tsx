import * as React from 'react';
import Head from 'next/head';
import {CacheProvider} from '@emotion/react';
import {createEmotionCache} from "./lib/create-emotion-cache";
import "firebaseui/dist/firebaseui.css"
import "react-datepicker/dist/react-datepicker.min.css"
import "antd/dist/antd.min.css"
import "./lib/styles/styles.scss"
import {ThemeEnvironment} from "./lib/styles/theme";

const clientSideEmotionCache = createEmotionCache()

export default function App({
                                Component,
                                pageProps,
                                emotionCache = clientSideEmotionCache
                            }) {
    const Layout = Component.getLayout ?? (({children}) => <>{children}</>)

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <meta name="viewport"
                      content="width=device-width, initial-scale=1, maximum-scale=1"/>
                <link rel="shortcut icon" href="/img/favicon.ico"/>
            </Head>
            <ThemeEnvironment>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </ThemeEnvironment>
        </CacheProvider>
    );
}
