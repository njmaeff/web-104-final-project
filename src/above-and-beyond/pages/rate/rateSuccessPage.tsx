import React from "react";
import {useEmployer} from "../home/useEmployer";
import {PageStatus, useFormWithStatus} from "../lib/hooks/useFormWithStatus";
import {RateSuccess, rateSuccessSchema, Uploads} from "../lib/orm/validate";
import {EmployerCollection} from "../lib/orm/docs";
import {
    FieldDateTimePickerRow,
    FieldInputRow,
    FormTable,
    FormUpload,
    TextInput
} from "../lib/input";
import {AbsoluteButton} from "../lib/button/absoluteFeatureButton";
import {Button} from "antd";
import {EditOutlined, SaveOutlined} from "@ant-design/icons";
import {useRouter} from "../routes";
import {useRole} from "../home/useRole";
import {HorizontalRule} from "../lib/layout/divider";
import {uploadFileList} from "../lib/upload";
import {useRoleFileUpload} from "../lib/storage/file";
import {ExportButtonFull} from "../lib/button/actionButton";

export const RateSuccessPage: React.FC<{ data?: RateSuccess }> = ({data}) => {
    const router = useRouter();

    const {currentEmployerID} = useEmployer();
    const {currentRoleID} = useRole()

    const storageRef = useRoleFileUpload('rate')

    const [, {
        fieldProps,
        setEdit,
        isEdit,
        isReadonly,
        onClickSave,
        useSubmitSuccess,
        setSubmitted,
    }] = useFormWithStatus<Partial<RateSuccess & Uploads>>({
        initialValues: data,
        initialStatus: data ? PageStatus.VIEW : PageStatus.EDIT,
        validationSchema: rateSuccessSchema,
        onSubmit: async ({uploads, ...values}, helpers) => {
            const ref = await EmployerCollection
                .fromID(currentEmployerID)
                .roles
                .withID(currentRoleID)
                .fromSubCollection<RateSuccess>("rate")
                .write({
                    ...values,
                    type: "success",
                });
            await uploadFileList(
                storageRef.child(ref.id),
                uploads,
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
                <FormUpload label={"Uploads"}
                            storageRef={storageRef.child(fieldProps.id?.value ?? "")}
                            isManualSubmit={!data || isEdit}
                            {...fieldProps.uploads}  />
            </FormTable>
            {isReadonly && <ExportButtonFull/>}
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
