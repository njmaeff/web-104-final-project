import React from "react";
import {
    FieldDateTimePickerRow,
    FieldInputRow,
    FieldTable,
    TextInput,
} from "../lib/input";
import {PageStatus, useFormWithStatus} from "../lib/hooks/useFormWithStatus";
import {EmployerCollection} from "../lib/orm/docs";
import {usePageCtx} from "../lib/hooks/usePageCtx";
import {Review, reviewSchema} from "../lib/orm/validate";
import {MenuTemplate} from "../lib/menuTemplate";

export const ReviewPage: React.FC = () => {
    const {currentEmployer, allEmployers, currentRoleID, currentEmployerID} =
        usePageCtx();
    const [formik, {
        mainProps,
        fieldProps
    }] = useFormWithStatus<Partial<Review>>({
        initialValues: {
            date: new Date(),
            adjustedSalary: "",
            manager: "",
            outcome: "",
        },
        initialStatus: PageStatus.EDIT,
        validationSchema: reviewSchema,
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
