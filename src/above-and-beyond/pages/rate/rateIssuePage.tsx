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
import {useRole} from "../employer/useRole";
import {AbsoluteButton} from "../lib/button/absoluteFeatureButton";
import {Button} from "antd";
import {SaveOutlined} from "@ant-design/icons";

export const RateIssuePage: React.FC<{ data?: RateIssue }> = ({data}) => {
    const {currentEmployerID} = useEmployer();
    const {currentRoleID} = useRole()

    const [formik, {
        fieldProps,
    }] = useFormWithStatus<Partial<RateIssue>>({
        initialValues: data,
        initialStatus: PageStatus.EDIT,
        validationSchema: rateIssueSchema,
        onSubmit: async (values) => {
            await EmployerCollection.fromID(currentEmployerID)
                .roles.withID(currentRoleID)
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

            <AbsoluteButton>
                <Button
                    type="primary"
                    icon={<SaveOutlined/>}
                    // loading={loadings[2]}
                    // onClick={() => this.enterLoading(2)}
                />
            </AbsoluteButton>
        </>
    );
};

