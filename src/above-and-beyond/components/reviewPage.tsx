import React from "react";
import {
    FieldDateTimePickerRow,
    FieldInputRow,
    FieldTable,
    TextInput,
} from "./input";
import { MenuTemplate } from "./page";
import { PageStatus, useFormWithStatus } from "../hooks/useFormWithStatus";
import { EmployerCollection, Review } from "../orm/docs";
import { usePageCtx } from "../hooks/usePageCtx";

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
                <FieldDateTimePickerRow heading={"Date"} {...fieldProps.date} />
                <FieldInputRow heading={"Manager"} {...fieldProps.manager} />
                <FieldInputRow
                    heading={"Adjusted Salary"}
                    {...fieldProps.adjustedSalary}
                />
            </FieldTable>
            <TextInput heading={"Outcome"} {...fieldProps.outcome} />
        </MenuTemplate>
    );
};
