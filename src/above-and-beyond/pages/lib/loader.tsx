import styled from "@emotion/styled";
import React, {CSSProperties} from "react";
import {css, keyframes} from "@emotion/react";

const Container = styled.div`
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
`
const spin = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`

const Spinner = styled.div<{ size: number }>`
    border: 16px solid ${({theme}) =>
        theme.colors.light
    };
    border-top: 16px solid ${({theme}) => theme.colors.dark};
    border-radius: 50%;
    width: 120px;
    height: 120px;
    animation: ${spin} 1.5s linear infinite;
`

export const Loader: React.FC<JSX.IntrinsicElements['div'] &
    { size?: number, position?: CSSProperties['position'] }> = ({
                                                                    size = 16,
                                                                    position = 'absolute',
                                                                    ...props
                                                                }) => (
    <div css={css`
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
    `} {...props}>
        <div css={theme => css`
            border: ${size}px solid ${theme.colors.light};
            border-top: ${size}px solid ${theme.colors.dark};
            border-radius: 50%;
            width: ${7.5 * size}px;
            height: ${7.5 * size}px;
            animation: ${spin} 1.5s linear infinite;
        `}/>
    </div>
);
