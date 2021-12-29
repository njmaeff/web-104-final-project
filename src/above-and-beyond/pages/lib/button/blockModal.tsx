import React, {useEffect, useState} from "react";
import pMinDelay from "p-min-delay";
import {Modal, Spin} from "antd";
import {css} from "@emotion/react";

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
        {visible && <Modal css={theme => css`
            background-color: ${theme.colors.light};
        `}
                           visible={true}
                           closable={false}
                           footer={null}
        >
            {children}
            <Spin/>
        </Modal>}
        <Component save={save} onCleanup={onCleanup}/>
    </>
};
