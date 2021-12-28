import React, {useEffect} from "react";
import {MDXProvider} from "@mdx-js/react";
import {useRouter} from "next/router";
import {checkAuthUI} from "../hooks/checkAuthUI";
import {NextPageWithLayout} from "../types";
import {WithoutSSR} from "../util/next";

export const Anchor: React.FC<JSX.IntrinsicElements["a"]> = ({
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
export const Environment = ({children}) => {
    return (
        <MDXProvider components={{
            a: MDXAnchor,
            wrapper: Wrapper,
        }}>
            {children}
        </MDXProvider>
    );
};

export const AppLayout: React.FC = ({children}) => {
    const router = useRouter();

    const {isLoggedIn} = checkAuthUI()

    useEffect(() => {
        if (isLoggedIn === false) {
            router.push('/login')
        }

    }, [isLoggedIn]);

    return <Environment>
        {children}
    </Environment>
}
export const WithAppLayout = (component, children?) => {

    const Component: NextPageWithLayout = () => (
        <WithoutSSR
            component={component}>
            {children}
        </WithoutSSR>
    )
    Component.getLayout = AppLayout

    return Component

};
