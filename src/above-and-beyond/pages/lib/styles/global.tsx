import {css, Global,} from "@emotion/react";
import {ThemeFunction} from "./types";
import {ScrollBar, withTablet} from "./mixins";


export const fonts = css`
    @font-face {
        font-family: 'fontello';
        src: url('/font/fontello.eot?19391138');
        src: url('/font/fontello.eot?19391138#iefix') format('embedded-opentype'),
        url('/font/fontello.woff2?19391138') format('woff2'),
        url('/font/fontello.woff?19391138') format('woff'),
        url('/font/fontello.ttf?19391138') format('truetype'),
        url('/font/fontello.svg?19391138#fontello') format('svg');
        font-weight: normal;
        font-style: normal;
    }

    /* Chrome hack: SVG is rendered more smooth in Windozze. 100% magic, uncomment if you need it. */
    /* Note, that will break hinting! In other OS-es font will be not as sharp as it could be */
    /*
    @media screen and (-webkit-min-device-pixel-ratio:0) {
      @font-face {
        font-family: 'fontello';
        src: url('font/fontello.svg?19391138#fontello') format('svg');
      }
    }
    */

    [class^="icon-"]:before, [class*=" icon-"]:before {
        font-family: "fontello";
        font-style: normal;
        font-weight: normal;
        speak: never;

        display: inline-block;
        text-decoration: inherit;
        width: 1em;
        margin-right: .2em;
        text-align: center;
        /* opacity: .8; */

        /* For safety - reset parent styles, that can break glyph codes*/
        font-variant: normal;
        text-transform: none;

        /* fix buttons height, for twitter bootstrap */
        line-height: 1em;

        /* Animation center compensation - margins should be symmetric */
        /* remove if not needed */
        margin-left: .2em;

        /* you can be more comfortable with increased icons size */
        /* font-size: 120%; */

        /* Font smoothing. That was taken from TWBS */
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;

        /* Uncomment for 3D effect */
        /* text-shadow: 1px 1px 1px rgba(127, 127, 127, 0.3); */
    }

    .icon-review:before {
        content: '\\e800';
    }

    /* '' */

    .icon-targets:before {
        content: '\\e801';
    }

    /* '' */

    .icon-settings:before {
        content: '\\e802';
    }

    /* '' */

    .icon-search:before {
        content: '\\e803';
    }

    /* '' */

    .icon-rate:before {
        content: '\\e806';
    }

    /* '' */

    .icon-logo:before {
        content: '\\e80a';
    }

    /* '' */

    .icon-issue:before {
        content: '\\e80b';
    }

    /* '' */

    .icon-home:before {
        content: '\\e80c';
    }

    /* '' */

    .icon-award:before {
        content: '\\e80f';
    }

    /* '' */

    .icon-edit:before {
        content: '\\e810';
    }

    /* '' */

    .icon-angle-down:before {
        content: '\\f107';
    }

    /* '' */

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
        ${fonts}
        :root {
            font-family: 'Rubik', sans-serif;
            ${ScrollBar(theme)}
            overscroll-behavior: contain;
        }


        * {
            box-sizing: border-box;
        }

        body {
            max-width: 960px;
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

        div.ant-dropdown ul {
            background-color: ${theme.colors.light};
        }

        div.ant-picker-panel-container {
            background-color: ${theme.colors.light} !important;
        }

    `}/>
};
