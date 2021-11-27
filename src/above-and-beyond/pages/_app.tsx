import * as React from 'react';
import Head from 'next/head';
import {CacheProvider} from '@emotion/react';
import {Environment} from '../components/environment';
import {createEmotionCache} from "../components/create-emotion-cache";

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
            <Environment>
                <Component {...pageProps} />
            </Environment>
        </CacheProvider>
    );
}
