import * as React from 'react';
import Head from 'next/head';
import {CacheProvider} from '@emotion/react';
import {createEmotionCache} from "../components/create-emotion-cache";
import "firebaseui/dist/firebaseui.css"
import "../styles/firebaseui.scss"
import "../styles/styles.scss"

const clientSideEmotionCache = createEmotionCache()

export default function App({
                                Component,
                                pageProps,
                                emotionCache = clientSideEmotionCache
                            }) {
    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <meta name="viewport"
                      content="width=device-width, initial-scale=1, maximum-scale=1"/>
                <link rel="shortcut icon" href="/img/favicon.ico"/>
            </Head>
            <Component {...pageProps} />
        </CacheProvider>
    );
}
