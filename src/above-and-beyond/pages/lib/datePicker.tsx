import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns';
import generatePicker from 'antd/es/date-picker/generatePicker';
import React from "react";
import type {PickerDateProps, PickerTimeProps} from "rc-picker/es/Picker";
import {css} from "@emotion/react";

export const DatePickerBase = generatePicker<Date>(dateFnsGenerateConfig) as any;
export const DatePicker = React.forwardRef<any, PickerDateProps<any>>((props, ref) => {
    return <DatePickerBase ref={ref} css={
        theme => css`
            background-color: ${theme.colors.light} !important;
            padding-left: 0;
            border: 2px solid ${theme.colors.grayLight};
            input {
                border: 1px solid ${theme.colors.grayLight};
            }
        `
    }  {...props}/>
});
export type TimePickerProps = Omit<PickerTimeProps<Date>, 'picker'>
export const TimePicker = React.forwardRef<any, TimePickerProps>((props, ref) => {
    return <DatePicker {...props} picker="time" mode={undefined} ref={ref}/>;
});
