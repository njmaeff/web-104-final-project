import {Meta} from "@storybook/react";
import {WithCenter} from "../sb/withCenter";
import {
    FieldDatePickerRow,
    FieldDateTimePickerRow,
    FieldInputRow,
    FormTable,
    FormUpload,
    FieldTextInput
} from "./form";
import {useRoleFileUpload} from "../storage/file";
import {WithLoginUser} from "../sb/withLoginUser";
import {useState} from "react";
import {WithFaker} from "../sb/withFaker";
import * as faker from "faker"

export const DatePickerRow = () => <FieldDatePickerRow label={'Date'}

                                                       value={new Date()}/>

export const DateTimePickerRow = () => <FieldDateTimePickerRow
    label={'Date Time'} value={new Date()}/>


export const InputRow = () => <FieldInputRow label={'Name'}
                                             value={faker.name.findName()}/>
export const Text = () => <FieldTextInput label={'Responsibilities'}
                                          value={faker.lorem.lines(3)}/>

export const Upload = () => {
    const storageRef = useRoleFileUpload('rate')
    const [uploads, setUploads] = useState([]);

    return <FormUpload label={'Upload'} value={uploads}
                       storageRef={storageRef.child('1')}
                       onChange={(file) => {
                           setUploads((prev) => [...prev, file])
                       }}
                       isManualSubmit={true}/>
}


const WithFormTable = (Story) => <FormTable><Story/></FormTable>
export default {
    decorators: [WithLoginUser, WithCenter, WithFormTable, WithFaker]
} as Meta
