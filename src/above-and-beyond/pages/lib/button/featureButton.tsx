import React from "react";
import {Button} from "antd";
import {css} from "@emotion/react";
import {Highlight} from "../styles/mixins";
import {PlusCircleOutlined} from "@ant-design/icons";

export const FeatureButton: React.FC<{
    edit?: boolean, valid?: boolean, loading?: boolean, onClick?: React.MouseEventHandler<HTMLElement>
}> = ({
          edit,
          valid,
          loading,
          onClick,
          ...props
      }) => {

    return <Button
        css={theme => css`
            ${edit && valid ? Highlight(theme.colors.success) : edit && !valid ? Highlight(theme.colors.primary) : ""}
            display: block;
            background-color: ${theme.colors.primary} !important;
            color: ${theme.colors.light} !important;
            padding: 0;
            border: none;
            width: 3.5rem;
            height: 3.5rem;

            p {
                font-size: 2.5rem;
                background-color: ${theme.colors.primary} !important;
                color: ${theme.colors.light} !important;
            }
        `}
        onClick={(e) => {
            e.preventDefault();
            onClick?.(e)
        }}
        type="primary"
        loading={loading}
        {...props}>
        {!loading && <p><PlusCircleOutlined/></p>}
    </Button>
};
