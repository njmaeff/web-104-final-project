import React from "react";
import {
    FieldDateTimePickerRow,
    FieldInputRow,
    FormTable,
    FormUpload,
    TextInput,
} from "../lib/input/form";
import {PageStatus, useFormWithStatus} from "../lib/hooks/useFormWithStatus";
import {EmployerCollection} from "../lib/orm/docs";
import {Review, reviewSchema, Uploads} from "../lib/orm/validate";
import {MenuLayout} from "../lib/layout/menuLayout";
import {useRole} from "../home/useRole";
import {useEmployer} from "../home/useEmployer";
import {AbsoluteButton} from "../lib/button/absoluteFeatureButton";
import {Button} from "antd";
import {EditOutlined, SaveOutlined} from "@ant-design/icons";
import {useRouter} from "../routes";
import {HorizontalRule} from "../lib/layout/divider";
import {useRoleFileUpload} from "../lib/storage/file";
import {uploadFileList} from "../lib/input/upload";

export const ReviewForm: React.FC<{ data?: Review }> = ({data}) => {
    const router = useRouter();
    const {currentEmployerID} = useEmployer()
    const {currentRoleID} = useRole()
    const storageRef = useRoleFileUpload('review')

    const [, {
        fieldProps,
        isEdit,
        setEdit,
        onClickSave,
        setSubmitted,
        useSubmitSuccess,
    }] = useFormWithStatus<Partial<Review & Uploads>>({
        initialValues: data,
        initialStatus: data ? PageStatus.VIEW : PageStatus.EDIT,
        validationSchema: reviewSchema,
        onSubmit: async ({uploads, ...values}, helpers) => {
            const ref = await EmployerCollection.fromID(currentEmployerID)
                .roles.withID(currentRoleID)
                .fromSubCollection("review")
                .write(values);

            await uploadFileList(
                storageRef.child(ref.id),
                uploads,
            )

            helpers.setValues({...values, id: ref.id});
        },
    });


    useSubmitSuccess((values) => {
        return router["review/view"].push({
            query: {
                id: values.id,
            }
        })
    })

    return <>
        <FormTable>
            <FieldDateTimePickerRow label={"Date"} {...fieldProps.date} />
            <FieldInputRow label={"Manager"} {...fieldProps.manager} />
            <FieldInputRow
                label={"Adjusted Salary"}
                monetary
                {...fieldProps.adjustedSalary}
            />
            <HorizontalRule/>
            <TextInput label={"Outcome"} {...fieldProps.outcome} />
            <FormUpload label={"Uploads"}
                        storageRef={storageRef.child(fieldProps.id?.value ?? "")}
                        isManualSubmit={!data || isEdit}
                        {...fieldProps.uploads}  />
        </FormTable>
        <AbsoluteButton Component={({save}) => <Button
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

};

export const ReviewPage: React.FC = () => {

    return (
        <MenuLayout
            heading={"Review"}
            Main={ReviewForm}
        />
    );
};
