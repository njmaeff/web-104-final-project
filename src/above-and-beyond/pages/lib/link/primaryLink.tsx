import React from "react";
import {css} from "@emotion/react";
import {controlStyles} from "../styles/mixins";

export const PrimaryLink: React.FC<JSX.IntrinsicElements['a']> = ({
                                                                      children,
                                                                      ...props
                                                                  }) => {

    return <a css={theme => css`
        ${controlStyles(theme)}
        margin: 0.5rem 0;
    `} {...props}>{children}</a>
};
