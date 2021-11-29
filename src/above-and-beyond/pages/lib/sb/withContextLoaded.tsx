import React from "react";
import { PageCtxProvider } from "../hooks/usePageCtx";

export const WithContextLoaded = (Story) => {
    return (
        <PageCtxProvider>
            <Story />
        </PageCtxProvider>
    );
};
