import React from "react";
import {css, Global} from "@emotion/react";

export const Report: React.FC = ({children}) => <>
    <Global styles={css`
        body {
            display: block !important;
            height: auto;
            background-color: white;
        }
    `}/>
    <div css={
        css`
            padding: 1rem 0;

            h1 {
                padding-left: 1rem;
            }

            .ant-descriptions-view {
                width: 100%;
            }

            .ant-descriptions-item {
                margin: 0 1rem;
            }
        `
    }>

        {children}
    </div>
</>
