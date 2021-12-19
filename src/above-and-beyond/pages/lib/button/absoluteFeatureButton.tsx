import styled from "@emotion/styled";
import {FeatureButton} from "./featureButton";

export const AbsoluteFeatureButton = styled(FeatureButton)`
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translate(-50%, 0);
    border-radius: 50%;
    z-index: 100;
`

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
    }

    span {
        font-size: 1.5rem;
    }
`

export const AbsoluteButton = ({children}) => {


    return <AbsoluteContainer>
        {children}
    </AbsoluteContainer>
};
