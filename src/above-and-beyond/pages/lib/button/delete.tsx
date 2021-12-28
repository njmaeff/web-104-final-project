import React from "react";
import {Button, ButtonProps} from "antd";
import {css} from "@emotion/react";
import {DeleteOutlined} from "@ant-design/icons";
import {lighten} from "polished";

export const DeleteButton = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {

    return <Button
        ref={ref}
        css={theme => css`
            display: block;
            background-color: ${lighten(0.1, theme.colors.error)} !important;
            color: ${theme.colors.light} !important;
            font-size: 1.5rem;
            height: auto;
        `}
        onClick={(e) => {
            e.preventDefault();
            props.onClick?.(e)
        }}
        type="primary"
        {...props}>
        <DeleteOutlined/>Delete
    </Button>
});
