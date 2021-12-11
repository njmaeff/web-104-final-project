import React from "react";
import {css} from "@emotion/react";
import {controlStyles} from "../styles/mixins";

export const PrimaryButton: React.FC<JSX.IntrinsicElements['button']> = ({
                                                                             children,
                                                                             ...props
                                                                         }) => {

    return <button css={theme => css`
        ${controlStyles(theme)}
        margin: 0.5rem 0;
    `} {...props}>{children}</button>
};
