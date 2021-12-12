import React from "react";
import {useEmployer} from "../employer/useEmployer";
import {PageStatus, useFormWithStatus} from "../lib/hooks/useFormWithStatus";
import {RateIssue, rateIssueSchema} from "../lib/orm/validate";
import {EmployerCollection} from "../lib/orm/docs";
import {
    FieldDateTimePickerRow,
    FieldInputRow,
    FieldTable,
    TextInput
} from "../lib/input";
import {RateYourselfTemplate} from "./ratePage";

export const RateIssuePage: React.FC = () => {
    const {currentEmployerID} = useEmployer();

    const [formik, {
        fieldProps,
    }] = useFormWithStatus<Partial<RateIssue>>({
        initialValues: {
            date: new Date(),
            value: "",
            situation: "",
            result: "",
            correction: "",
        },
        initialStatus: PageStatus.EDIT,
        validationSchema: rateIssueSchema,
        onSubmit: async (values) => {
            await EmployerCollection.fromID(currentEmployerID)
                .roles.withID(currentEmployerID)
                .fromSubCollection("rate")
                .write({
                    ...values,
                    type: "issue",
                });
            formik.resetForm({
                values: formik.initialValues,
            });
        },
    });

    return (
        <>
            <FieldTable>
                <FieldDateTimePickerRow
                    label={"Date"} {...fieldProps.date} />
                <FieldInputRow
                    label={"Estimated Value"}
                    {...fieldProps.value}
                />
            </FieldTable>
            <TextInput label={"Situation"} {...fieldProps.situation} />
            <TextInput label={"Result"} {...fieldProps.result} />
            <TextInput
                label={"Correction"} {...fieldProps.correction} />
        </>
    );
};

export default () => <RateYourselfTemplate
    type={'issue'}
    heading={"Rate - Issue"}
><RateIssuePage/></RateYourselfTemplate>
