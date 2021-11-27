import React from "react";
import { Page } from "@njmaeff/webpack-static-site/components/page";
import { Link } from "@njmaeff/webpack-static-site/components/link";
import Styles from "../styles.scss";

export const PageTemplate: typeof Page = ({
    title,
    extraTags = [],
    children,
}) => {
    return (
        <Page
            title={title}
            extraTags={[
                <Link href={Styles} type={"text/css"} rel="stylesheet" />,
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="favicon/apple-touch-icon.png"
                />,
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="favicon/favicon-32x32.png"
                />,
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="favicon/favicon-16x16.png"
                />,
                <link rel="manifest" href="favicon/site.webmanifest" />,
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1"
                />,
                ...extraTags,
            ]}
        >
            {children}
        </Page>
    );
};
