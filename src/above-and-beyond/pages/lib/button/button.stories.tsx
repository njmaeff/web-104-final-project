import {Meta} from "@storybook/react";
import {
    ButtonPanelContainer,
    ExportButtonFull,
    RemoveButtonFull
} from "./actionButton";
import {WithCenter} from "../sb/withCenter";
import {actions} from '@storybook/addon-actions'
import React from "react";

const buttonActions = actions('onClick')

export const RemoveButton = () => <RemoveButtonFull {...buttonActions}/>

export const ExportButton = () => <ExportButtonFull {...buttonActions}/>

export const FullPanel = () => <ButtonPanelContainer>
    <ExportButtonFull {...buttonActions}/>
    <RemoveButtonFull {...buttonActions}/>
</ButtonPanelContainer>

export default {
    decorators: [WithCenter]
} as Meta
