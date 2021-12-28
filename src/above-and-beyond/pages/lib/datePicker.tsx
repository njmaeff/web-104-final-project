import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns';
import generatePicker from 'antd/es/date-picker/generatePicker';
import React from "react";
import type {PickerTimeProps} from "rc-picker/es/Picker";

export const DatePicker = generatePicker<Date>(dateFnsGenerateConfig);
export type TimePickerProps = Omit<PickerTimeProps<Date>, 'picker'>
export const TimePicker = React.forwardRef<any, TimePickerProps>((props, ref) => {
    return <DatePicker {...props} picker="time" mode={undefined} ref={ref}/>;
});
