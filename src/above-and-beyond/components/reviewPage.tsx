import React from "react";
import {
    FieldDateTimePickerRow,
    FieldInputRow,
    FieldTable,
    TextInput,
} from "./input";
import { MenuTemplate } from "./page";
import { PageStatus, useFormWithStatus } from "../hooks/useFormWithStatus";
import { EmployerCollection} from "../orm/docs";
import { usePageCtx } from "../hooks/usePageCtx";
import {Review} from "../orm/validate";

export const ReviewPage: React.FC = () => {
    const { currentEmployer, allEmployers, currentRoleID, currentEmployerID } =
        usePageCtx();
    const [formik, { mainProps, fieldProps }] = useFormWithStatus<
        Partial<Review>
    >({
        initialValues: {
            date: new Date(),
            adjustedSalary: "",
            manager: "",
            outcome: "",
        },
        initialStatus: PageStatus.EDIT,
        onSubmit: async (values) => {
            await EmployerCollection.fromID(currentEmployerID)
                .roles.withID(currentRoleID)
                .fromSubCollection("review")
                .write(values);
            formik.resetForm({
                values: formik.initialValues,
            });
        },
    });
    return (
        <MenuTemplate
            currentEmployer={currentEmployer}
            allEmployers={allEmployers}
            heading={"Review"}
            {...mainProps}
        >
            <FieldTable>
                <FieldDateTimePickerRow label={"Date"} {...fieldProps.date} />
                <FieldInputRow label={"Manager"} {...fieldProps.manager} />
                <FieldInputRow
                    label={"Adjusted Salary"}
                    {...fieldProps.adjustedSalary}
                />
            </FieldTable>
            <TextInput label={"Outcome"} {...fieldProps.outcome} />
        </MenuTemplate>
    );
};
