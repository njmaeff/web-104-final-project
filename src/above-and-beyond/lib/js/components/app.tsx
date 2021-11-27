import React from "react";
import { RouterProvider, useRouter } from "../../hooks/useRouter";
import { PageCtxProvider } from "../../hooks/usePageCtx";
import { RateIssuePage, RateSuccessPage } from "./ratePage";
import { ReviewPage } from "./reviewPage";
import { MainPage } from "./mainPage";
import { ProfilePage } from "./profilePage";
import { EditPage } from "./editPage";

export const Environment = ({ children }) => {
    return (
        <RouterProvider
            routes={[
                ["/", MainPage],
                ["/profile", ProfilePage],
                ["/rate/success", RateSuccessPage],
                ["/rate/issue", RateIssuePage],
                ["/edit", EditPage],
                ["/review", ReviewPage],
            ]}
        >
            <PageCtxProvider>{children}</PageCtxProvider>
        </RouterProvider>
    );
};

export const App = () => {
    const { Component } = useRouter();
    return <Component />;
};

export const Main = () => (
    <Environment>
        <App />
    </Environment>
);
