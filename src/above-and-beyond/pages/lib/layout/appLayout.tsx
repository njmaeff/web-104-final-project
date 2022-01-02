import React from "react";
import {MDXProvider} from "@mdx-js/react";
import {useRouter} from "next/router";
import {checkAuthUI} from "../hooks/checkAuthUI";
import {NextPageWithLayout} from "../types";
import {WithoutSSR} from "../util/next";
import {AsyncHook} from "../hooks/useAsync";
import {LoaderCircle} from "../feedback/loaderCircle";

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

export const MDXLayout: React.FC = ({children}) => {
    return <AppLayout>
        <Environment>
            {children}
        </Environment>
    </AppLayout>
}

export const AppLayout: React.FC = ({children}) => {
    const router = useRouter();

    const {isLoggedIn} = checkAuthUI()

    const loginStatus = new AsyncHook(async () => {
        if (isLoggedIn === false) {
            return router.push('/login')
        }
    }, [isLoggedIn]);

    return loginStatus.isInProgress ? <LoaderCircle/> : <>{children}</>
};

export const WithoutSSRLayout = (Layout?) => (component, children?) => {

    const Component: NextPageWithLayout = () => (
        <WithoutSSR
            component={component}>
            {children}
        </WithoutSSR>
    )
    Component.getLayout = Layout

    return Component

}

export const WithSSRLayout = (Layout?) => (Component: NextPageWithLayout) => {
    Component.getLayout = Layout
    return Component
};

export const WithoutSSRMDXLayout = WithoutSSRLayout(MDXLayout)

export const WithoutSSRAppLayout = WithoutSSRLayout(AppLayout)
