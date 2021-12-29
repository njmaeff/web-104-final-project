import React, {useState} from "react";
import {Button, ButtonProps, Modal} from "antd";
import {css} from "@emotion/react";
import {DeleteOutlined} from "@ant-design/icons";
import {BlockModal} from "./blockModal";

export const RemoveButton: React.FC<ButtonProps & { onCleanup }> = ({
                                                                        onClick,
                                                                        onCleanup: cleanupFunction,
                                                                        ...props
                                                                    }) => {

    return <BlockModal

        Component={({save, onCleanup}) => {
            const [visible, setVisible] = useState(false);
            onCleanup(cleanupFunction)
            return <><Button
                css={theme => css`
                    background-color: transparent !important;
                    color: ${theme.colors.dark} !important;
                    border: none;
                `}
                onClick={(e) => {
                    e.stopPropagation();
                    setVisible(true)
                }}
                type="primary"
                {...props}>
                <DeleteOutlined/>{props.children}
            </Button>
                <Modal title="Please Confirm"
                       visible={visible}
                       onOk={(e) => {
                           e.stopPropagation()
                           save(onClick)
                           setVisible(false)
                       }}
                       onCancel={(e) => {
                           e.stopPropagation()
                           setVisible(false)
                       }}
                       okText="Confirm"
                       cancelText="Cancel"
                >
                    <p>This record will be deleted and cannot be recovered.</p>
                </Modal>
            </>
        }}>
        Removing...
    </BlockModal>
};


export const ActionButton = ({onNew, onRemove}) => {

    return <div
        css={theme => css`
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 1.5rem;
        `}
    >
        <RemoveButton>Remove</RemoveButton>
    </div>
};
