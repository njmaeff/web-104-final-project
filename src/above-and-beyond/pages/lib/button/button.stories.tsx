import {Meta} from "@storybook/react";
import {ExportButtonFull, RemoveButtonFull} from "./actionButton";
import {WithCenter} from "../sb/withCenter";

export const RemoveButton = () => <RemoveButtonFull/>

export const ExportButton = () => <ExportButtonFull/>

export default {
    title: 'buttons',
    decorators: [WithCenter]
} as Meta
