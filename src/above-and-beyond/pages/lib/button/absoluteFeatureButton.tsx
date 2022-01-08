import styled from "@emotion/styled";
import React from "react";
import {BlockModal} from "../modal/blockModal";

const AbsoluteContainer = styled.div`
    position: fixed;
    bottom: 1rem;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 100;

    button {
        background-color: ${({theme}) => theme.colors.primary};
        border-radius: 20%;
        width: 3rem;
        height: 3rem;
        color: ${({theme}) => theme.colors.light};
    }

    span {
        font-size: 1.5rem;
    }
`

export const AbsoluteButton: typeof BlockModal = (props) => {

    return <AbsoluteContainer>
        <BlockModal {...props}>
            Saving...
        </BlockModal>
    </AbsoluteContainer>
};
