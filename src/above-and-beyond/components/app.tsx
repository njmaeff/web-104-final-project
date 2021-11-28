import React from "react";
import {PageCtxProvider} from "../hooks/usePageCtx";
import {MDXProvider} from "@mdx-js/react";
import {MainPage} from "./mainPage";
import {ProfilePage} from "./profilePage";
import {RateIssuePage, RateSuccessPage} from "./ratePage";
import {EditPage} from "./editPage";
import {ReviewPage} from "./reviewPage";
import {router} from "next/client";

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
            <PageCtxProvider>{children}</PageCtxProvider>
        </MDXProvider>
    );
};

const routes = new Map([
    ["main", MainPage],
    ["profile", ProfilePage],
    ["rate/success", RateSuccessPage],
    ["rate/issue", RateIssuePage],
    ["edit", EditPage],
    ["review", ReviewPage],
])


export const App = () => {
    const Component = routes.get(router.query.page as string)
    return <Component/>
};

export const Main = () => (
    <Environment>
        <App/>
    </Environment>
);

export default Main
