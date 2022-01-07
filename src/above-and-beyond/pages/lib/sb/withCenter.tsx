import React from "react";
import {css} from "@emotion/react";

export const WithCenter = (Story) => {
    return (
        <div css={css`
            position: relative;
            height: 100%;
            width: 100%;
        `}>
            <div css={css`
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 2rem;
            `}>
                <Story/>
            </div>
        </div>
    );
};
