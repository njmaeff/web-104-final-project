import React from "react";
import {useEmployer} from "../employer/useEmployer";
import {PageStatus, useFormWithStatus} from "../lib/hooks/useFormWithStatus";
import {RateIssue, rateIssueSchema, Uploads} from "../lib/orm/validate";
import {EmployerCollection} from "../lib/orm/docs";
import {
    FieldDateTimePickerRow,
    FieldInputRow,
    FormTable,
    FormUpload,
    TextInput
} from "../lib/input";
import {useRole} from "../employer/useRole";
import {AbsoluteButton} from "../lib/button/absoluteFeatureButton";
import {Button} from "antd";
import {EditOutlined, SaveOutlined} from "@ant-design/icons";
import {useRouter} from "../routes";
import {HorizontalRule} from "../lib/layout/divider";
import {useFileUpload} from "../lib/storage/file";
import {uploadFileList} from "../lib/upload";

export const RateIssuePage: React.FC<{ data?: RateIssue }> = ({data}) => {

    const router = useRouter();
    const {currentEmployerID} = useEmployer();
    const {currentRoleID} = useRole()

    const storageRef = useFileUpload('rate')

    const [, {
        fieldProps,
        isEdit,
        onClickSave,
        setEdit,
        setSubmitted,
        useSubmitSuccess
    }] = useFormWithStatus<Partial<RateIssue & Uploads>>({
        initialValues: data,
        initialStatus: data ? PageStatus.VIEW : PageStatus.EDIT,
        validationSchema: rateIssueSchema,
        onSubmit: async ({uploads, ...values}, helpers) => {
            const ref = await EmployerCollection
                .fromID(currentEmployerID)
                .roles
                .withID(currentRoleID)
                .fromSubCollection<RateIssue>("rate")
                .write({
                    ...values,
                    type: "issue",
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
    })


    return (
        <>
            <FormTable>
                <FieldDateTimePickerRow
                    label={"Date"} {...fieldProps.date} />
                <FieldInputRow
                    label={"Estimated Value"}
                    monetary
                    {...fieldProps.value}
                />
                <HorizontalRule/>
                <TextInput label={"Situation"} {...fieldProps.situation} />
                <TextInput label={"Result"} {...fieldProps.result} />
                <TextInput
                    label={"Correction"} {...fieldProps.correction} />
                <FormUpload label={"Uploads"}
                            storageRef={storageRef.child(fieldProps.id?.value ?? "")}
                            isManualSubmit={!data || isEdit}
                            {...fieldProps.uploads}  />
            </FormTable>

            <AbsoluteButton Control={({save}) => <Button
                type="primary"
                icon={isEdit ? <SaveOutlined/> : <EditOutlined/>}
                onClick={async () => {
                    if (isEdit) {
                        await save(() => onClickSave());
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

