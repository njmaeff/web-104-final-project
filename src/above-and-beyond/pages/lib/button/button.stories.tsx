import {Meta} from "@storybook/react";
import * as Buttons from "./actionButton";
import {WithCenter} from "../sb/withCenter";
import {actions} from '@storybook/addon-actions'
import React from "react";

const buttonActions = actions('onClick')

export const RemoveButtonSmall = () =>
    <Buttons.RemoveButton {...buttonActions} />
export const RemoveButtonFull = () =>
    <Buttons.RemoveButtonFull {...buttonActions}/>


export const ExportButtonSmall = () =>
    <Buttons.ExportButton {...buttonActions} />
export const ExportButtonFull = () =>
    <Buttons.ExportButtonFull {...buttonActions}/>

export const FullPanel = () => <Buttons.ButtonPanelContainer>
    <Buttons.ExportButtonFull {...buttonActions}/>
    <Buttons.RemoveButtonFull {...buttonActions}/>
</Buttons.ButtonPanelContainer>

export default {
    decorators: [WithCenter]
} as Meta
