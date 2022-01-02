import {MediaFunction, ThemeFunction} from "./types";
import {css} from "@emotion/react";
import {darken} from "polished";

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
export const controlStyles: ThemeFunction = (theme,) => css`
    background-color: ${theme.colors.primary};
    color: ${theme.colors.light};
    font-size: 1.25rem;
    padding: 0.5rem 2rem;
    opacity: 0.8;
    border-radius: 4px;
    border: none;

    &:hover, &:active {
        background-color: ${darken(0.15, theme.colors.primary)};
    }
`
export const ButtonSmallMixin: ThemeFunction = theme => css`

    background-color: transparent !important;
    color: ${theme.colors.dark} !important;
    border: none;
    box-shadow: none;

    &:focus, &:active {
        border: 2px solid ${theme.colors.darkLight};
        color: ${theme.colors.dark};
        transition: none;
    }

    &:hover {
        border: none;
    }

`
export const ButtonFullMixin: ThemeFunction = (theme) => css`
    border: 2px solid ${theme.colors.grayLight};
    background-color: transparent;
    color: ${theme.colors.darkLight};
    align-self: flex-start;
`
