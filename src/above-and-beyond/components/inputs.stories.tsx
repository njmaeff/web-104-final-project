import { Meta } from "@njmaeff/storybook-react/react";
import React from "react";
import { WithCenter } from "../sb/withCenter";

import {
    FieldDatePickerRow,
    FieldDateTimePickerRow,
    FieldInputRow,
    FieldTable as Field,
    TextInput as Text,
} from "./input";
import { useFormWithStatus } from "../hooks/useFormWithStatus";

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
            heading={"Text Input"}
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
            <FieldInputRow heading={"Field"} {...fieldProps.fieldInput} />
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
                heading={"Date"}
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
                heading={"Date"}
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
