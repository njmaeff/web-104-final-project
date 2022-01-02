import React, {useEffect, useState} from "react";
import pMinDelay from "p-min-delay";
import {Modal, ModalProps} from "antd";
import {css} from "@emotion/react";
import {LoaderCircleSmallRelative} from "../loaderCircle";

export const BlockModalContainer: React.FC<ModalProps> = ({
                                                              children,
                                                              ...props
                                                          }) => {
    return <Modal css={theme => css`
        background-color: ${theme.colors.light};
        padding: 0;

        .ant-modal-body {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    `}
                  closable={false}
                  footer={null}
                  {...props}
    >
        {children}
        <LoaderCircleSmallRelative/>
    </Modal>
};

export const BlockModal: React.FC<{ Component: React.FC<{ save?, onCleanup? }> }> = ({
                                                                                         Component,
                                                                                         children,
                                                                                     }) => {

    const [visible, setVisible] = useState(false);
    const [saved, setSaved] = useState(false);
    const save = async (fn) => {

        try {
            setVisible(true)
            await pMinDelay(fn(), 1000);
            setVisible(false)
        } catch (e) {
            setVisible(false)
            throw e;
        }
        setSaved(true)
    };

    const onCleanup = (fn) => useEffect(() => {
        if (saved) {
            fn?.()
        }
    }, [saved]);

    return <>
        {visible && <BlockModalContainer
            visible={true}
        >
            {children}
        </BlockModalContainer>}
        <Component save={save} onCleanup={onCleanup}/>
    </>
};
