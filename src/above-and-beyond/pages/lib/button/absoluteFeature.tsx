import styled from "@emotion/styled";
import {FeatureButton} from "./feature";
import {Modal, Spin} from "antd";
import {useState} from "react";
import {css} from "@emotion/react";
import pMinDelay from 'p-min-delay';

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

export const AbsoluteButton: React.FC<{ Control?: React.ElementType<{ save }> }> = ({
                                                                                        children,
                                                                                        Control
                                                                                    }) => {
    const [visible, setVisible] = useState(false);
    const save = async (fn) => {

        try {
            setVisible(true)
            await pMinDelay(fn(), 1000);
            setVisible(false)
        } catch (e) {
            setVisible(false)
            throw e;
        }
    };

    return <AbsoluteContainer>
        {visible && <Modal css={theme => css`
            background-color: ${theme.colors.light};
        `}
                           visible={true}
                           closable={false}
                           footer={null}
        >
            Saving...
            <Spin/>
        </Modal>}
        <Control save={save}/>
        {children}
    </AbsoluteContainer>
};
