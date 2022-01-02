import {Meta} from "@storybook/react";
import {WithCenter} from "../sb/withCenter";
import {actions} from '@storybook/addon-actions'
import React from "react";
import {
    ButtonPanelContainer,
    ExportButton,
    ExportButtonFull,
    RemoveButton,
    RemoveButtonFull
} from "./actionButton";

const buttonActions = actions('onClick')

export const RemoveSmall = () =>
    <RemoveButton {...buttonActions} />
export const RemoveFull = () =>
    <RemoveButtonFull {...buttonActions}/>


export const ExportSmall = () =>
    <ExportButton {...buttonActions} />
export const ExportFull = () =>
    <ExportButtonFull {...buttonActions}/>

export const FullPanel = () => <ButtonPanelContainer>
    <ExportButtonFull {...buttonActions}/>
    <RemoveButtonFull {...buttonActions}/>
</ButtonPanelContainer>

export default {
    decorators: [WithCenter]
} as Meta
