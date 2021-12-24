import React from "react";
import {useEmployer} from "../employer/useEmployer";
import {PageStatus, useFormWithStatus} from "../lib/hooks/useFormWithStatus";
import {RateSuccess, rateSuccessSchema} from "../lib/orm/validate";
import {EmployerCollection} from "../lib/orm/docs";
import {
    FieldDateTimePickerRow,
    FieldInputRow,
    FormTable,
    TextInput
} from "../lib/input";
import {AbsoluteButton} from "../lib/button/absoluteFeatureButton";
import {Button} from "antd";
import {EditOutlined, SaveOutlined} from "@ant-design/icons";
import {useRouter} from "../routes";
import {useRole} from "../employer/useRole";
import {HorizontalRule} from "../lib/layout/divider";
import {UploadContainer, useUpload} from "../lib/upload";
import {useFileUpload} from "../lib/storage/file";

export const RateSuccessPage: React.FC<{ data?: RateSuccess }> = ({data}) => {
    const router = useRouter();

    const {currentEmployerID} = useEmployer();
    const {currentRoleID} = useRole()

    const upload = useUpload({
        storageRef: useFileUpload('rate', data?.id ?? "")
    })

    const [, {
        fieldProps,
        setEdit,
        isEdit,
        onClickSave,
        useSubmitSuccess,
        setSubmitted,
    }] = useFormWithStatus<Partial<RateSuccess>>({
        initialValues: data,
        initialStatus: data ? PageStatus.VIEW : PageStatus.EDIT,
        validationSchema: rateSuccessSchema,
        onSubmit: async (values, helpers) => {
            const ref = await EmployerCollection
                .fromID(currentEmployerID)
                .roles
                .withID(currentRoleID)
                .fromSubCollection<RateSuccess>("rate")
                .write({
                    ...values,
                    type: "success",
                });
            await upload.manualSubmit(
                ref.id,
            )
            helpers.setValues({...values, id: ref.id})
        },
    });

    useSubmitSuccess((values) => {
        return router["rate/view"].push({
            query: {
                id: values.id,
            }
        })
    });

    return (
        <>
            <FormTable>
                <FieldDateTimePickerRow label={"Date"} {...fieldProps.date} />
                <FieldInputRow
                    label={"Estimated Value"}
                    monetary
                    {...fieldProps.value}
                />
                <HorizontalRule/>
                <TextInput label={"Situation"} {...fieldProps.situation} />
                <TextInput label={"Result"} {...fieldProps.result} />
            </FormTable>
            <h3>Uploads</h3>
            <UploadContainer isManualSubmit={!data || isEdit} {...upload} />

            <AbsoluteButton Control={({save}) => <Button
                type="primary"
                icon={isEdit ? <SaveOutlined/> : <EditOutlined/>}
                onClick={async () => {
                    if (isEdit) {
                        await save(async () => {
                            await onClickSave()

                        });
                        setSubmitted();
                    } else {
                        setEdit()
                    }
                }}
            />
            }/>
        </>
    );
};
