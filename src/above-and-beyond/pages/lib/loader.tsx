import styled from "@emotion/styled";
import React from "react";
import {keyframes} from "@emotion/react";

// export const Loader = () => (
//     <Spin/>
// );

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

const Spinner = styled.div`
    border: 16px solid ${({theme}) =>
        theme.colors.light
    };
    border-top: 16px solid ${({theme}) => theme.colors.dark};
    border-radius: 50%;
    width: 120px;
    height: 120px;
    animation: ${spin} 1.5s linear infinite;
`

export const Loader = () => (
    <Container>
        <Spinner/>
    </Container>
);
