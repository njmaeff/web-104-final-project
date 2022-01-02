import React, {useState} from "react";
import {Button, ButtonProps} from "antd";
import {css} from "@emotion/react";
import {CloudDownloadOutlined, DeleteOutlined} from "@ant-design/icons";
import {BlockModal} from "../modal/blockModal";
import {ConfirmModal} from "../modal/confirmModal";
import {ButtonFullMixin, ButtonSmallMixing} from "../styles/mixins";

export const RemoveButton: React.FC<ButtonProps & { onCleanup? }> = ({
                                                                         className,
                                                                         onClick,
                                                                         onCleanup: cleanupFunction,
                                                                         ...props
                                                                     }) => {

    return <BlockModal

        Component={({save, onCleanup}) => {
            const [visible, setVisible] = useState(false);
            onCleanup(cleanupFunction)
            return <><Button
                className={className}
                css={theme => css`
                    ${ButtonSmallMixing(theme)}
                `}
                onClick={(e) => {
                    e.stopPropagation();
                    setVisible(true)
                }}
                type="primary"
                {...props}>
                <DeleteOutlined/>{props.children}
            </Button>
                <ConfirmModal
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
                >
                    This record will be deleted and cannot be recovered.
                </ConfirmModal>
            </>
        }}>
        Removing...
    </BlockModal>
};

export const ExportButton: React.FC<ButtonProps & { onCleanup? }> = ({
                                                                         children,
                                                                         className,
                                                                         onCleanup: cleanupFunction,
                                                                         onClick,
                                                                         ...props
                                                                     }) => {

    return <BlockModal Component={({save, onCleanup}) => {
        onCleanup(cleanupFunction)
        return <Button
            className={className}
            css={theme => css`
                ${ButtonSmallMixing(theme)}
            `}
            onClick={(e) => {
                e.stopPropagation();
                save(onClick)
            }}
            type="primary"
            {...props}>
            <CloudDownloadOutlined/>
            {children}
        </Button>
    }}>
        Downloading...
    </BlockModal>
};

export const ExportButtonFull: typeof ExportButton = (props => {

    return <ExportButton css={theme => css`
        ${ButtonFullMixin(theme)}
    `} {...props}>Export</ExportButton>
});

export const RemoveButtonFull: typeof RemoveButton = (props => {

    return <RemoveButton css={theme => css`
        ${ButtonFullMixin(theme)}

    `} {...props}>Remove</RemoveButton>
});


export const ButtonPanelContainer: React.FC = ({children}) => {

    return <div
        css={theme => css`
            display: flex;
            align-items: center;
            margin-top: 1.5rem;

            button {
                margin-right: 0.5rem;
            }
        `}
    >
        {children}
    </div>
};
