import React from "react";
import {controlStyles} from "../styles/mixins";
import {css} from "@emotion/react";

export const PrimaryLink = React.forwardRef<HTMLAnchorElement, JSX.IntrinsicElements['a']>(({
                                                                                                children,
                                                                                                ...props
                                                                                            }, ref) => {

    return <a ref={ref} css={theme => css`
        ${controlStyles(theme)}
        margin: 0.5rem 0;
    `} {...props}>{children}</a>
});
