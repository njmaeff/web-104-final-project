import React, {useEffect} from "react";
import {MDXProvider} from "@mdx-js/react";
import {PageCtxProvider} from "../../hooks/usePageCtx";
import {useRouter} from "next/router";
import {checkAuthUI} from "../../hooks/checkAuthUI";

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
            <PageCtxProvider>{children}</PageCtxProvider>
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
