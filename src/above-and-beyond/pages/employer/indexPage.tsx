import {EmployerCollection, getEmployer} from "../lib/orm/docs";
import {useFormWithStatus} from "../lib/hooks/useFormWithStatus";
import {Employer, employerSchema, Role, roleSchema} from "../lib/orm/validate";
import React, {useEffect, useState} from "react";
import {
    FieldDatePickerRow,
    FieldDropDownInput,
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


export const EmployerForm: React.FC<{ currentEmployer?: Employer, allEmployers?: Employer[] }> = ({
                                                                                                      currentEmployer,
                                                                                                      allEmployers
                                                                                                  }) => {

    const employerAPI = getEmployer();

    const [formik, form] = useFormWithStatus<Employer>({
        initialValues: currentEmployer,
        validationSchema: employerSchema,
        onSubmit: async (values, helpers) => {
            await employerAPI.write(values);
            helpers.setValues(values)
        },
    })

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

export const RoleForm: React.FC<{ currentRole: Role, allRoles: Role[] }> = ({
                                                                                currentRole,
                                                                                allRoles
                                                                            }) => {
    const {
        currentEmployerID,
    } = useEmployer()

    const [formik, form] = useFormWithStatus<Role>({
        initialValues: currentRole,
        validationSchema: roleSchema,
        onSubmit: async (values, helpers) => {
            await EmployerCollection.fromID(
                currentEmployerID
            ).roles.write(values);
            helpers.setValues(values)
        },
    })

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

    const {
        currentEmployerID,
        useCurrents: useEmployerCurrents,
    } = useEmployer();
    const {currentRoleID, useCurrents: useRoleCurrents} = useRole();

    const employerData = useEmployerCurrents()
    const roleData = useRoleCurrents();

    const isLoadingEmployer = employerData.isLoading
    const isLoadingRole = roleData.isLoading

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
            HeaderDropDown={menu.activeKey === 'role' ? () =>
                <EmployerDropDown {...employerData.result}/> : null}
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
                             }))}>
                    <TabPane tab="Employer" key="employer">
                        <EmployerForm {...employerData.result}/>
                    </TabPane>
                    <TabPane tab="Role" key="role" disabled={menu.disableRole}>
                        <RoleForm {...roleData.result}/>
                    </TabPane>
                </Tabs>
            }}
        />
    );
};

export default () => WithEnvironment(MainPage)
