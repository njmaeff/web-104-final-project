import {Theme, ThemeProvider} from "@emotion/react";
import React from "react";
import {GlobalStyles} from "./global";
import {lighten} from "polished";

declare module "@emotion/react" {
    interface Theme {
        colors?: {
            primary: string
            secondary: string
            light: string
            dark: string
            error: string
            success: string
            warning: string
            gray: string
            grayLight: string
        }
        media?: {
            tablet: string
            desktop: string
        }
    }
}

const gray = "#9A9A9A";

export const defaultTheme: Theme = {
    colors: {
        light: "#F0F0F0",
        dark: "#3F4747",
        gray,
        primary: "#0661C1",
        secondary: "#218CFF",
        error: "red",
        success: "green",
        warning: "yellow",
        grayLight: lighten('.15', gray)
    },
    media: {
        tablet: "48rem",
        desktop: "64rem"
    }
}

export const ThemeEnvironment: React.FC = ({children}) => {

    return <ThemeProvider theme={defaultTheme}>
        <GlobalStyles/>
        {children}
    </ThemeProvider>
}
