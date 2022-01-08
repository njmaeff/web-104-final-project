import {WithFirebase} from "../sb/withFirebase";
import {Meta} from "@storybook/react";
import {WithCenter} from "../sb/withCenter";
import {FieldDatePickerRow, FieldDateTimePickerRow, FormTable} from "./form";


export const DatePickerRow = () => <FieldDatePickerRow label={'Date'}

                                                       value={new Date()}/>

export const DateTimePickerRow = () => <FieldDateTimePickerRow
    label={'Date Time'} value={new Date()}/>

const WithFormTable = (Story) => <FormTable><Story/></FormTable>
export default {
    decorators: [WithCenter, WithFormTable, WithFirebase]
} as Meta
