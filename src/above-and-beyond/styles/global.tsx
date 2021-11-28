import {css, Global,} from "@emotion/react";
import {MediaFunction, ThemeFunction} from "./types";
import {ScrollBar} from "./mixins";


export const withTablet: MediaFunction = (theme, defs) => css`
    @media (min-width: ${theme.media.tablet}) {
        ${defs}
    }

`

export const cssReset: ThemeFunction = (theme) => css`
    /* http://meyerweb.com/eric/tools/css/reset/
    v2.0 | 20110126
    License: none (public domain)
    */

    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed,
    figure, figcaption, footer, header, main,
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        font: inherit;
        vertical-align: baseline;
    }

    /* HTML5 display-role reset for older browsers */

    article, aside, details, figcaption, figure,
    footer, header, main, menu, nav, section {
        display: block;
    }

    body {
        line-height: 1;
    }

    ol, ul {
        list-style: none;
    }

    blockquote, q {
        quotes: none;
    }

    blockquote:before, blockquote:after,
    q:before, q:after {
        content: '';
        content: none;
    }

    table {
        border-collapse: collapse;
        border-spacing: 0;
    }

    /* end of Eric Meyer's Reset CSS */

`

export const GlobalStyles = () => {

    return <Global styles={(theme) => css`
        /* https://fonts.google.com/specimen/Rubik?query=rubik */
        @import url('https://fonts.googleapis.com/css2?family=Rubik&display=swap');

         ${cssReset(theme)}
        :root {
            font-family: 'Rubik', sans-serif;
            ${ScrollBar(theme)}
        }


        * {
            box-sizing: border-box;
        }

        body {
            max-width: 960px;
            height: 100%;
            background-color: ${theme.colors.light};
            color: ${theme.colors.dark};
            margin: 0 auto;

            /* https://stackoverflow.com/questions/46167604/ios-html-disable-double-tap-to-zoom */
            touch-action: manipulation;
        }

        h1 {
            font-size: 4rem;
            margin: 1rem 0;
        }

        h2 {
            font-size: 1.5rem;
            margin: 1.5rem 0;
        }

        h3 {
            font-size: 1.2rem;
            margin: 1rem 0;
        }

        li {
            margin: 0.2rem 1.5rem;
        }

        a {
            text-align: center;

            text-decoration: none;
            color: ${theme.colors.dark};

            &:visited, &:hover, &:active {
                color: inherit;
            }

        }

        p, textarea, input {
            font-size: 0.8rem;
            margin: 0.2rem 0.5rem;
            line-height: 1.3rem;
            background-color: ${theme.colors.light};
            color: ${theme.colors.dark};
        }

        img {
            max-width: 100%;
            width: 80%;
            text-align: center;
        }

        ${withTablet(theme, css`
            :root {
                font-size: 1rem;
            }
        `)}
        p.firebase-emulator-warning {
            top: 0;
            height: 30px;
            width: 200px !important;
            overflow: hidden;
            display: none !important;
        }

    `}/>
};
