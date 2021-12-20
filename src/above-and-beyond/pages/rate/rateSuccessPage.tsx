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
import {Button, Divider} from "antd";
import {EditOutlined, SaveOutlined} from "@ant-design/icons";

export const RateSuccessPage: React.FC<{ data?: RateSuccess }> = ({data}) => {
    const {currentEmployerID} = useEmployer();
    const [, {
        fieldProps,
        setEdit,
        setView,
        isEdit,
        onClickSave
    }] = useFormWithStatus<Partial<RateSuccess>>({
        initialValues: data,
        initialStatus: data ? PageStatus.VIEW : PageStatus.EDIT,
        validationSchema: rateSuccessSchema,
        onSubmit: async (values) => {
            await EmployerCollection.fromID(currentEmployerID)
                .roles.withID(currentEmployerID)
                .fromSubCollection("rate")
                .write({
                    ...values,
                    type: "success",
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
                <Divider/>
                <TextInput label={"Situation"} {...fieldProps.situation} />
                <TextInput label={"Result"} {...fieldProps.result} />
            </FieldTable>
            <AbsoluteButton Control={({save}) => <Button
                type="primary"
                icon={isEdit ? <SaveOutlined/> : <EditOutlined/>}
                onClick={async () => {
                    if (isEdit) {
                        await save(() => onClickSave());
                        setView()

                    } else {
                        setEdit()
                    }
                }}
            />
            }/>
        </>
    );
};
