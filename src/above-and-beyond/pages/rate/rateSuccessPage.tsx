import React from "react";
import {useEmployer} from "../employer/useEmployer";
import {PageStatus, useFormWithStatus} from "../lib/hooks/useFormWithStatus";
import {RateSuccess, rateSuccessSchema} from "../lib/orm/validate";
import {EmployerCollection} from "../lib/orm/docs";
import {
    FieldDateTimePickerRow,
    FieldInputRow,
    FieldTable,
    TextInput
} from "../lib/input";
import {AbsoluteButton} from "../lib/button/absoluteFeatureButton";
import {Button} from "antd";
import {SaveOutlined} from "@ant-design/icons";

export const RateSuccessPage: React.FC<{data?: RateSuccess}> = ({data}) => {
    const {currentEmployerID} = useEmployer();
    const [formik, {
        fieldProps,
    }] = useFormWithStatus<Partial<RateSuccess>>({
        initialValues: data,
        initialStatus: PageStatus.EDIT,
        validationSchema: rateSuccessSchema,
        onSubmit: async (values) => {
            await EmployerCollection.fromID(currentEmployerID)
                .roles.withID(currentEmployerID)
                .fromSubCollection("rate")
                .write({
                    ...values,
                    type: "success",
                });
            formik.resetForm({
                values: formik.initialValues,
            });
        },
    });
    return (
        <>
            <FieldTable>
                <FieldDateTimePickerRow label={"Date"} {...fieldProps.date} />
                <FieldInputRow
                    label={"Estimated Value"}
                    {...fieldProps.value}
                />
            </FieldTable>
            <TextInput label={"Situation"} {...fieldProps.situation} />
            <TextInput label={"Result"} {...fieldProps.result} />
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
