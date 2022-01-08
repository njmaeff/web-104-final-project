import {INITIAL_VIEWPORTS} from "@storybook/addon-viewport";
import {RouterContext} from "next/dist/shared/lib/router-context"
import {WithTheme} from "../pages/lib/sb/withTheme";
import 'antd/dist/antd.css';
import "firebaseui/dist/firebaseui.css"

export default {
    parameters: {
        nextRouter: {
            Provider: RouterContext.Provider,
        },
        viewport: {
            viewports: INITIAL_VIEWPORTS,
            defaultViewport: "iphonex",
        },
    }
}

export const parameters = {
    // actions: {argTypesRegex: '^on.*'},
    nextRouter: {
        Provider: RouterContext.Provider,
    },
    viewport: {
        viewports: INITIAL_VIEWPORTS,
        defaultViewport: "iphonex",
    },
}

export const decorators = [WithTheme];
