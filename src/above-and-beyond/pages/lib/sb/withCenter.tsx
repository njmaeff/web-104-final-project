import React from "react";
import {css} from "@emotion/react";

export const WithCenter = (Story) => {
    return (
        <div css={css`
            height: 100vh;
            width: 100vw;
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
