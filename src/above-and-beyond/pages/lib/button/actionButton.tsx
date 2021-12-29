import React from "react";
import {Button, ButtonProps} from "antd";
import {css} from "@emotion/react";
import {DeleteOutlined, PlusCircleOutlined} from "@ant-design/icons";
import {BlockModal} from "./blockModal";

export const RemoveButton: React.FC<ButtonProps> = ({onClick, ...props}) => {
    return <BlockModal Component={({save}) => {

        return <Button
            css={theme => css`
                //display: block;
                background-color: ${theme.colors.light} !important;
                color: ${theme.colors.dark} !important;
                border: none;
                //border-radius: 5px;
                //margin: 0.5rem;
                //font-size: 1rem;
                //height: auto;
            `}
            onClick={(e) => {
                e.preventDefault();
                save(onClick)
            }}
            type="primary"
            {...props}>
            <DeleteOutlined/>{props.children}
        </Button>

    }} message={'Removing...'}/>
};


export const AddButton = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {

    return <Button
        ref={ref}
        css={theme => css`
            display: block;
            background-color: ${theme.colors.primary} !important;
            color: ${theme.colors.light} !important;
            border: 2px solid ${theme.colors.primary};
            border-radius: 5px;
            margin: 0.5rem;
            font-size: 1rem;
            height: auto;
        `}
        onClick={(e) => {
            e.preventDefault();
            props.onClick?.(e)
        }}
        type="primary"
        {...props}>
        <PlusCircleOutlined/>{props.children}
    </Button>
});

export const ActionButton = ({onNew, onRemove}) => {

    return <div
        css={theme => css`
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 1.5rem;
        `}
    >
        <AddButton>Create</AddButton>
        <RemoveButton>Remove</RemoveButton>
    </div>
};
