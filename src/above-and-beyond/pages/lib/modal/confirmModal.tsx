import {Modal, ModalProps} from "antd";
import {css} from "@emotion/react";
import {ExclamationCircleOutlined} from "@ant-design/icons";
import React from "react";

export const ConfirmModal: React.FC<ModalProps> = (props) => <Modal title={
    <div css={css`
        display: flex;
        align-items: center;

        h1 {
            font-size: 1rem;
            margin: 0 1rem;

        }
    `}>
        <ExclamationCircleOutlined css={theme => css`
            color: ${theme.colors.primary};
        `}/>
        <h1>Please Confirm</h1>
    </div>
}
                                                                    okText="Confirm"
                                                                    cancelText="Cancel"
                                                                    {...props}
/>
