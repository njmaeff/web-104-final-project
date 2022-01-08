import {Meta} from "@storybook/react";
import {WithCenter} from "../sb/withCenter";
import {
    FieldDatePickerRow,
    FieldDateTimePickerRow,
    FormTable,
    FormUpload
} from "./form";
import {useRoleFileUpload} from "../storage/file";
import {WithLoginUser} from "../sb/withLoginUser";


export const DatePickerRow = () => <FieldDatePickerRow label={'Date'}

                                                       value={new Date()}/>

export const DateTimePickerRow = () => <FieldDateTimePickerRow
    label={'Date Time'} value={new Date()}/>

export const Upload = () => {
    const storageRef = useRoleFileUpload('rate')
    return <FormUpload label={'Upload'} value={[]}
                       storageRef={storageRef.child('1')}
                       onChange={() => {
                       }}
                       isManualSubmit={true}/>
}

const WithFormTable = (Story) => <FormTable><Story/></FormTable>
export default {
    decorators: [WithLoginUser, WithCenter, WithFormTable]
} as Meta
