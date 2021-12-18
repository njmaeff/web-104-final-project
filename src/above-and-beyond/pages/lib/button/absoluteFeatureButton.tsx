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
