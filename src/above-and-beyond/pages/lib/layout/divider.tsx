import {css} from "@emotion/react";
import React from "react";
import {Divider} from "antd";

export const HorizontalLine = () => {
    return <Divider css={theme => css`
        background-color: ${theme.colors.grayLight};
    `}/>

};
