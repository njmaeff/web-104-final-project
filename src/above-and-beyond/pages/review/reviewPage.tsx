import React from "react";
import {
    FieldDateTimePickerRow,
    FieldInputRow,
    FieldTable,
    TextInput,
} from "../lib/input";
import {PageStatus, useFormWithStatus} from "../lib/hooks/useFormWithStatus";
import {EmployerCollection} from "../lib/orm/docs";
import {Review, reviewSchema} from "../lib/orm/validate";
import {MenuTemplate} from "../lib/menuTemplate";
import {useRole} from "../employer/useRole";
import {useEmployer} from "../employer/useEmployer";
import {AbsoluteButton} from "../lib/button/absoluteFeatureButton";
import {Button, Divider} from "antd";
import {EditOutlined, SaveOutlined} from "@ant-design/icons";
import {useRouter} from "../routes";

export const ReviewForm: React.FC<{ data?: Review }> = ({data}) => {
    const router = useRouter();
    const {currentEmployerID} = useEmployer()
    const {currentRoleID} = useRole()
    const [, {
        fieldProps,
        isEdit,
        isSubmitting,
        setEdit,
        onClickSave,
        useSubmitSuccess,
        setSubmitted,
    }] = useFormWithStatus<Partial<Review>>({
        initialValues: data,
        initialStatus: data ? PageStatus.VIEW : PageStatus.EDIT,
        validationSchema: reviewSchema,
        onSubmit: async (values, helpers) => {
            const ref = await EmployerCollection.fromID(currentEmployerID)
                .roles.withID(currentRoleID)
                .fromSubCollection("review")
                .write(values);
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
        <FieldTable>
            <FieldDateTimePickerRow label={"Date"} {...fieldProps.date} />
            <FieldInputRow label={"Manager"} {...fieldProps.manager} />
            <FieldInputRow
                label={"Adjusted Salary"}
                {...fieldProps.adjustedSalary}
            />
            <Divider/>
            <TextInput label={"Outcome"} {...fieldProps.outcome} />
        </FieldTable>
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

};

export const ReviewPage: React.FC = () => {

    return (
        <MenuTemplate
            heading={"Review"}
            Main={ReviewForm}
        />
    );
};
