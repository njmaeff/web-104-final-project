import React from "react";
import {controlStyles} from "../styles/mixins";
import {css} from "@emotion/react";
import {Typography} from "antd"

export const ButtonLink: typeof Typography.Link = React.forwardRef((props, ref) => {

    return <Typography.Link ref={ref} css={theme => css`
        background-color: ${theme.colors.primary};
        color: ${theme.colors.light} !important;
        ${controlStyles(theme)}
    `} {...props}/>
});
