import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns';
import generatePicker from 'antd/es/date-picker/generatePicker';
import React from "react";
import type {PickerDateProps, PickerTimeProps} from "rc-picker/es/Picker";
import {css} from "@emotion/react";

export const DatePickerBase = generatePicker<Date>(dateFnsGenerateConfig) as any;
export const DatePicker = React.forwardRef<any, PickerDateProps<Date> | PickerTimeProps<Date>>((props, ref) => {
    return <DatePickerBase ref={ref} css={
        css`
            padding-left: 0;
            margin: 0.2rem 0;
        `
    }  {...props}/>
});
export type TimePickerProps = Omit<PickerTimeProps<Date>, 'picker'>
export const TimePicker = React.forwardRef<any, TimePickerProps>((props, ref) => {
    return <DatePicker picker="time" mode={undefined} ref={ref} {...props}/>;
});
