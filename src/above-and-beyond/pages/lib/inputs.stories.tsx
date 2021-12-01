import React from "react";
import { WithCenter } from "./sb/withCenter";

import {
    FieldDatePickerRow,
    FieldDateTimePickerRow,
    FieldInputRow,
    FieldTable as Field,
    TextInput as Text,
} from "./input";
import { useFormWithStatus } from "./hooks/useFormWithStatus";
import {Meta} from "@storybook/react";

export const TextInput = () => {
    const [, { fieldProps }] = useFormWithStatus({
        initialValues: {
            textInput: "",
        },
        onSubmit: () => {},
    });
    return (
        <Text
            width={"70%"}
            height={"5rem"}
            label={"Text Input"}
            {...fieldProps.textInput}
        />
    );
};

export const FieldInputTable = () => {
    const [, { fieldProps }] = useFormWithStatus({
        initialValues: {
            fieldInput: "",
        },
        onSubmit: () => {},
    });
    return (
        <Field heading={"Details"}>
            <FieldInputRow label={"Field"} {...fieldProps.fieldInput} />
        </Field>
    );
};

export const FieldDatePicker = () => {
    const [, { fieldProps }] = useFormWithStatus({
        initialValues: {
            fieldInput: new Date(),
        },
        onSubmit: () => {},
    });

    return (
        <Field heading={"Details"}>
            <FieldDatePickerRow
                label={"Date"}
                {...fieldProps.fieldInput}
                readonly={false}
            />
        </Field>
    );
};

export const FieldDateTimePicker = () => {
    const [, { fieldProps }] = useFormWithStatus({
        initialValues: {
            fieldInput: new Date(),
        },
        onSubmit: () => {},
    });

    return (
        <Field heading={"Details"}>
            <FieldDateTimePickerRow
                label={"Date"}
                {...fieldProps.fieldInput}
                readonly={false}
            />
        </Field>
    );
};

export default {
    title: "inputs",
    decorators: [WithCenter],
} as Meta;
