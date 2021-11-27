import React from "react";
import {RouterProvider, useRouter} from "../hooks/useRouter";
import {PageCtxProvider} from "../hooks/usePageCtx";
import {RateIssuePage, RateSuccessPage} from "./ratePage";
import {ReviewPage} from "./reviewPage";
import {MainPage} from "./mainPage";
import {ProfilePage} from "./profilePage";
import {EditPage} from "./editPage";
import {MDXProvider} from "@mdx-js/react";

const Anchor: React.FC<JSX.IntrinsicElements["a"]> = ({
                                                          children,
                                                          ...props
                                                      }) => {
    return (
        <a {...props}>
            {children}
        </a>
    );
};

export const MDXAnchor = ({children, ...props}) => (
    <Anchor target={"_blank"} rel={"noopener noreferrer"} {...props}>
        {children}
    </Anchor>
);

export const Wrapper = ({children}) => {
    return <div>{children}</div>;
};

const components = {
    a: MDXAnchor,
    wrapper: Wrapper,
};

export const Environment = ({children}) => {
    return (
        <MDXProvider components={components}>
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
        </MDXProvider>
    );
};

export const App = () => {
    const {Component} = useRouter();
    return <Component/>;
};

export const Main = () => (
    <Environment>
        <App/>
    </Environment>
);
