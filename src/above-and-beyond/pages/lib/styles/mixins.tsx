import {MediaFunction, ThemeFunction} from "./types";
import {css} from "@emotion/react";

export const ScrollBar: ThemeFunction = (theme) => css`
    /* width */

    ::-webkit-scrollbar {
        width: 5px;
    }

    /* Track */

    ::-webkit-scrollbar-track {
        background: ${theme.colors.light};
    }

    /* Handle */

    ::-webkit-scrollbar-thumb {
        background: ${theme.colors.primary};
    }

    /* Handle on hover */

    ::-webkit-scrollbar-thumb:hover {
        background: ${theme.colors.secondary};
    }
`

export const Highlight = (color) => css`
    border: 2px solid ${color} !important;
    box-shadow: 0 0 3px ${color} !important;
`;

export const withTablet: MediaFunction = (theme, defs) => css`
    @media (min-width: ${theme.media.tablet}) {
        ${defs}
    }

`
