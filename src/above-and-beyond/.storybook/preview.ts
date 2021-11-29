import {INITIAL_VIEWPORTS} from "@storybook/addon-viewport";
import {RouterContext} from "next/dist/shared/lib/router-context"


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
    nextRouter: {
        Provider: RouterContext.Provider,
    },
    viewport: {
        viewports: INITIAL_VIEWPORTS,
        defaultViewport: "iphonex",
    },
}
