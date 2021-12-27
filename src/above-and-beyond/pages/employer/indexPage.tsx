import {EmployerCollection, getEmployer} from "../lib/orm/docs";
import {useFormWithStatus} from "../lib/hooks/useFormWithStatus";
import {Employer, employerSchema, Role, roleSchema} from "../lib/orm/validate";
import React, {useEffect, useState} from "react";
import {
    FieldDatePickerRow,
    FieldInputRow,
    FormTable,
    TextInput
} from "../lib/input";
import {EmployerDropDown, RoleDropDown} from "../lib/control";
import {useEmployer} from "./useEmployer";
import {useRole} from "./useRole";
import {AbsoluteButton} from "../lib/button/absoluteFeatureButton";
import {MenuLayout} from "../lib/layout/menuLayout";
import {Button, Tabs} from "antd";
import {EditOutlined, SaveOutlined} from "@ant-design/icons";
import {TabPane} from "rc-tabs";
import {WithEnvironment} from "../lib/withEnvironment";
import {Loader} from "../lib/loader";
import {css} from "@emotion/react";
import {ScrollBar} from "../lib/styles/mixins";
import {useRouter} from "../routes";


export const EmployerForm = () => {

    const {currentEmployer, updateEmployer,} = useEmployer();
    const employerAPI = getEmployer();

    const [, form] = useFormWithStatus<Partial<Employer>>({
        initialValues: currentEmployer.result,
        validationSchema: employerSchema,
        onSubmit: async (values, helpers) => {
            form.setView();
            helpers.setValues(values)
            const ref = await employerAPI.write(values);
            updateEmployer(ref.id)
        },
    })

    return <>
        <FormTable>
            <FieldInputRow
                label={"Name"}
                {...form.fieldProps.name}
            />
            <FieldInputRow
                label={"Location"}
                {...form.fieldProps.location}
            />
        </FormTable>
        <AbsoluteButton Control={({save}) => <Button
            type="primary"
            icon={form.isEdit ? <SaveOutlined/> : <EditOutlined/>}
            onClick={async () => {
                if (form.isEdit) {
                    await save(() => {
                        return form.onClickSave()
                    })
                    form.setView();
                } else {
                    form.setEdit()
                }

            }}
        />}
        />
    </>
};

export const RoleForm = () => {
    const router = useRouter()

    const {
        currentEmployerID,
    } = useEmployer()
    const {currentRole, updateRole} = useRole();

    const [, form] = useFormWithStatus<Partial<Role>>({
        initialValues: currentRole.result,
        validationSchema: roleSchema,
        onSubmit: async (values, helpers) => {
            await EmployerCollection.fromID(
                currentEmployerID
            ).roles.write(values);
            form.setView();
            helpers.setValues(values)

        },
    })

    form.useSubmitSuccess(() => router.employer.push())

    return <>
        <FormTable>
            <FieldInputRow
                label={"Name"}
                {...form.fieldProps.name}
            />
            <FieldDatePickerRow
                label={"Start Date"}
                {...form.fieldProps.startDate}
            />
            <FieldInputRow
                label={"Current Salary"}
                {...form.fieldProps.salary}
            />
            <FieldInputRow
                label={"Target Salary"}
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
            <AbsoluteButton Control={({save}) => <Button
                type="primary"
                icon={form.isEdit ? <SaveOutlined/> : <EditOutlined/>}
                onClick={async () => {
                    if (form.isEdit) {
                        await save(() => {
                            return form.onClickSave()
                        })
                        form.setView();
                    } else {
                        form.setEdit()
                    }

                }}
            />}
            />

        </FormTable></>
};

export const MainPage = () => {
    const [menu, setMenu] = useState<{ activeKey?: string, heading?: string, disableRole?: boolean }>({})

    const {isLoading: isLoadingEmployer, currentEmployerID} = useEmployer();
    const {isLoading: isLoadingRole, currentRoleID} = useRole();

    useEffect(() => {
        if (!(isLoadingRole && isLoadingEmployer)) {

            if (!(currentEmployerID && currentRoleID)) {
                setMenu({
                    activeKey: "employer",
                    disableRole: true,
                    heading: "New Employer",
                })
            } else if (currentEmployerID && !currentRoleID) {
                setMenu({
                    activeKey: "role",
                    heading: "New Role"
                });
            } else if (currentEmployerID && currentRoleID) {
                setMenu({
                    activeKey: "role",
                    heading: "Above and Beyond"
                });
            }
        }
    }, [isLoadingRole, isLoadingEmployer]);

    const isLoading = isLoadingRole || isLoadingEmployer
    return (
        isLoading ? <Loader/> : <MenuLayout
            heading={menu.heading}
            HeaderDropDown={menu.activeKey === 'role' ? RoleDropDown : EmployerDropDown}
            Main={() => {

                return <Tabs css={
                    theme => css`
                        overflow-y: scroll;
                        padding: 0 0.5rem;
                        ${ScrollBar(theme)};
                    `
                } defaultActiveKey={menu.activeKey}
                             onChange={(key) => setMenu(prev => ({
                                 ...prev,
                                 activeKey: key,
                                 heading: key === 'role' ? "Role" : "Employer"
                             }))}>
                    <TabPane tab="Employer" key="employer">
                        <EmployerForm/>
                    </TabPane>
                    <TabPane tab="Role" key="role" disabled={menu.disableRole}>
                        <RoleForm/>
                    </TabPane>
                </Tabs>
            }}
        />
    );
};

export default () => WithEnvironment(MainPage)
