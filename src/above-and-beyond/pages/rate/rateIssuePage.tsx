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
import {Button, Divider} from "antd";
import {EditOutlined, SaveOutlined} from "@ant-design/icons";
import {css} from "@emotion/react";

export const RateIssuePage: React.FC<{ data?: RateIssue }> = ({data}) => {

    const {currentEmployerID} = useEmployer();
    const {currentRoleID} = useRole()

    const [, {
        fieldProps,
        isEdit,
        onClickSave,
        setEdit,
        setView,
    }] = useFormWithStatus<Partial<RateIssue>>({
        initialValues: data,
        initialStatus: data ? PageStatus.VIEW : PageStatus.EDIT,
        validationSchema: rateIssueSchema,
        onSubmit: async (values) => {
            await EmployerCollection.fromID(currentEmployerID)
                .roles.withID(currentRoleID)
                .fromSubCollection("rate")
                .write({
                    ...values,
                    type: "issue",
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
                <Divider css={theme => css`
                    background-color: ${theme.colors.grayLight};
                `}/>
                <TextInput label={"Situation"} {...fieldProps.situation} />
                <TextInput label={"Result"} {...fieldProps.result} />
                <TextInput
                    label={"Correction"} {...fieldProps.correction} />
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

