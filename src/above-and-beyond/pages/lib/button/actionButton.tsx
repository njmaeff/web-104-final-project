import React, {useState} from "react";
import {Button, ButtonProps, Modal} from "antd";
import {css} from "@emotion/react";
import {
    CloudDownloadOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined
} from "@ant-design/icons";
import {BlockModal} from "./blockModal";
import {ThemeFunction} from "../styles/types";

export const ButtonSmallMixing: ThemeFunction = theme => css`

    background-color: transparent !important;
    color: ${theme.colors.dark} !important;
    border: none;
    box-shadow: none;

`

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
                <Modal title={
                    <div css={css`
                        display: flex;
                        align-items: center;

                        h1 {
                            font-size: 1rem;
                            margin: 0 1rem;

                        }
                    `}>
                        <ExclamationCircleOutlined/>
                        <h1>Please Confirm</h1>
                    </div>
                }
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
                    This record will be deleted and cannot be recovered.
                </Modal>
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

export const ButtonFullMixin: ThemeFunction = (theme) => css`border: 2px solid ${theme.colors.grayLight};
    color: ${theme.colors.dark};
    align-self: flex-start;
`

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
