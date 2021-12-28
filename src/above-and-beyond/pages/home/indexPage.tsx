import {EmployerCollection, getEmployer} from "../lib/orm/docs";
import {PageStatus, useFormWithStatus} from "../lib/hooks/useFormWithStatus";
import {
    Employer,
    employerSchema,
    Role,
    roleSchema,
    Uploads
} from "../lib/orm/validate";
import React from "react";
import {
    FieldDatePickerRow,
    FieldDropDownInput,
    FieldInputRow,
    FormTable,
    FormUpload,
    TextInput
} from "../lib/input";
import {EmployerDropDown, RoleDropDown} from "../lib/control";
import {useEmployer} from "./useEmployer";
import {useRole} from "./useRole";
import {AbsoluteButton} from "../lib/button/absoluteFeature";
import {MenuLayout} from "../lib/layout/menuLayout";
import {Button, Tabs} from "antd";
import {EditOutlined, SaveOutlined} from "@ant-design/icons";
import {TabPane} from "rc-tabs";
import {WithEnvironment} from "../lib/withEnvironment";
import {Loader} from "../lib/loader";
import {css} from "@emotion/react";
import {ScrollBar} from "../lib/styles/mixins";
import {useFileUpload} from "../lib/storage/file";
import {DeleteButton} from "../lib/button/delete";
import {useRouter} from "../routes";


export const EmployerForm: React.FC<{ currentEmployer?: Employer, allEmployers?: Employer[], onSubmit? }> = ({
                                                                                                                 currentEmployer,
                                                                                                                 allEmployers,
                                                                                                                 onSubmit,
                                                                                                             }) => {

    const employerAPI = getEmployer();
    const storageRef = useFileUpload('employer')

    const [formik, form] = useFormWithStatus<Employer & Uploads>({
        initialValues: currentEmployer,
        validationSchema: employerSchema,
        initialStatus: currentEmployer ? PageStatus.VIEW : PageStatus.EDIT,
        onSubmit: async (values, helpers) => {
            await employerAPI.write(values);
            helpers.setValues(values)
        },
    })

    form.useSubmitSuccess((values) => onSubmit?.(values))

    return <>
        <FormTable>
            <FieldDropDownInput
                label={"Name"}
                DropDown={() => <EmployerDropDown
                    currentEmployer={formik.values}
                    allEmployers={allEmployers}/>}
                {...form.fieldProps.name}
            />
            <FieldInputRow
                label={"Location"}
                {...form.fieldProps.location}
            />
            <FormUpload label={"Uploads"}
                        storageRef={storageRef.child(form.fieldProps.id?.value ?? "")}
                        isManualSubmit={!currentEmployer || form.isEdit}
                        {...form.fieldProps.uploads}  />
            {form.isReadonly && <DeleteButton/>}
        </FormTable>
        <AbsoluteButton Control={({save}) => <Button
            type="primary"
            icon={form.isEdit ? <SaveOutlined/> : <EditOutlined/>}
            onClick={async () => {
                if (form.isEdit) {
                    await save(() => {
                        return form.onClickSave()
                    })
                    form.setSubmitted();
                } else {
                    form.setEdit()
                }

            }}
        />}
        />
    </>
};

export const RoleForm: React.FC<{ currentRole?: Role, allRoles?: Role[], onSubmit? }> = ({
                                                                                             currentRole,
                                                                                             allRoles,
                                                                                             onSubmit,
                                                                                         }) => {
    const {
        currentEmployerID,
    } = useEmployer()
    const storageRef = useFileUpload('role')

    const [formik, form] = useFormWithStatus<Role & Uploads>({
        initialValues: currentRole,
        validationSchema: roleSchema,
        initialStatus: currentRole ? PageStatus.VIEW : PageStatus.EDIT,
        onSubmit: async (values, helpers) => {
            await EmployerCollection.fromID(
                currentEmployerID
            ).roles.write(values);
            helpers.setValues(values)
        },
    })

    form.useSubmitSuccess((values) => onSubmit?.(values))

    return <>
        <FormTable>
            <FieldDropDownInput
                DropDown={() => <RoleDropDown currentRole={formik.values}
                                              allRoles={allRoles}/>}
                label={"Name"}
                {...form.fieldProps.name}
            />
            <FieldDatePickerRow
                label={"Start Date"}
                {...form.fieldProps.startDate}
            />
            <FieldInputRow
                label={"Current Salary"}
                monetary
                {...form.fieldProps.salary}
            />
            <FieldInputRow
                label={"Target Salary"}
                monetary
                {...form.fieldProps.salaryTarget}
            />
            <TextInput
                {...form.fieldProps.skillTarget}
                height={"auto"}
                label={"Skills"}
            />

            <TextInput
                {...form.fieldProps.responsibilities}
                height={"auto"}
                label={"Responsibilities"}
            />
            <FormUpload label={"Uploads"}
                        storageRef={storageRef.child(form.fieldProps.id?.value ?? "")}
                        isManualSubmit={!currentRole || form.isEdit}
                        {...form.fieldProps.uploads}  />

            {form.isReadonly && <DeleteButton/>}
        </FormTable>
        <AbsoluteButton Control={({save}) => <Button
            type="primary"
            icon={form.isEdit ? <SaveOutlined/> : <EditOutlined/>}
            onClick={async () => {
                if (form.isEdit) {
                    await save(() => {
                        return form.onClickSave()
                    })
                    form.setSubmitted();
                } else {
                    form.setEdit()
                }

            }}
        />}
        />
    </>
};

export const MainPage = () => {
    const router = useRouter();

    const {
        useCurrents: useEmployerCurrents,
    } = useEmployer();

    const {useCurrents: useRoleCurrents} = useRole();

    const employerData = useEmployerCurrents()
    const roleData = useRoleCurrents();

    return (
        employerData.isInProgress || roleData.isInProgress ? <Loader/> :
            <MenuLayout
                heading={'Home'}
                Main={() => {

                    return <Tabs css={
                        theme => css`
                            overflow-y: scroll;
                            padding: 0 0.5rem;
                            ${ScrollBar(theme)};
                        `
                    } defaultActiveKey={router.home.query().menu ?? 'role'}
                                 onChange={(key) => router.home.push({
                                     query: {
                                         menu: key,
                                     }
                                 })}>
                        <TabPane tab="Employers" key="employer">
                            <EmployerForm {...employerData.result}/>
                        </TabPane>
                        <TabPane tab="Roles" key="role">
                            <RoleForm {...roleData.result}/>
                        </TabPane>
                    </Tabs>
                }}
            />
    );
};

export default () => WithEnvironment(MainPage)
