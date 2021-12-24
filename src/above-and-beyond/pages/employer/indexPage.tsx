import {EmployerCollection, getEmployer} from "../lib/orm/docs";
import {mergeForms, useFormWithStatus} from "../lib/hooks/useFormWithStatus";
import {Employer, employerSchema, Role, roleSchema} from "../lib/orm/validate";
import React from "react";
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
import {useAsync} from "../lib/hooks/useAsync";
import {AbsoluteButton} from "../lib/button/absoluteFeatureButton";
import {MenuTemplate} from "../lib/menuTemplate";
import {Button} from "antd";
import {EditOutlined, SaveOutlined} from "@ant-design/icons";

export const MainPageForm: React.FC = () => {
    const {
        currentEmployerID,
        updateEmployer,
        currentEmployer
    } = useEmployer()
    const {currentRoleID, updateRole} = useRole();

    const currentRole = useAsync<Role>(async () => {
        if (currentEmployerID) {
            return await EmployerCollection.fromID(currentEmployerID).roles.read(currentRoleID);
        }
    }, [currentRoleID]);

    const employerAPI = getEmployer();

    const [mainProps, [employerFormik, employerForm], [roleFormik, roleForm]] =
        mergeForms(
            useFormWithStatus<Partial<Employer>>({
                initialValues: currentEmployer.result,
                validationSchema: employerSchema,
                onSubmit: async (values, helpers) => {
                    employerForm.setView();
                    helpers.setValues(values)
                    const ref = await employerAPI.write(values);
                    updateEmployer(ref.id)
                },
            }),
            useFormWithStatus<Partial<Role>>({
                initialValues: currentRole.result,
                validationSchema: roleSchema,
                onSubmit: async (values, helpers) => {
                    roleForm.setView();
                    helpers.setValues(values)
                    const ref = await EmployerCollection.fromID(
                        currentEmployerID
                    ).roles.write(values);
                    updateRole(ref.id)

                },
            })
        );

    currentRole.onSuccess((result) => {
        roleFormik.resetForm({values: result});
    })

    currentEmployer.onSuccess((result) => {
        employerFormik.resetForm({values: result})
    })

    return <>
        <FormTable>
            <FieldInputRow
                label={"Organization Name"}
                {...employerForm.fieldProps.name}
            />
            <FieldInputRow
                label={"Location"}
                {...employerForm.fieldProps.location}
            />
        </FormTable>
        <FormTable>
            <FieldDropDownInput
                label={"Role"}
                DropDown={RoleDropDown}
                {...roleForm.fieldProps.name}
            />

            <FieldDatePickerRow
                label={"Start Date"}
                {...roleForm.fieldProps.startDate}
            />
            <FieldInputRow
                label={"Current Salary"}
                {...roleForm.fieldProps.salary}
            />
            <FieldInputRow
                label={"Target Salary"}
                {...roleForm.fieldProps.salaryTarget}
            />
        </FormTable>

        <TextInput
            {...roleForm.fieldProps.skillTarget}
            height={"auto"}
            label={"Skills"}
        />

        <TextInput
            {...roleForm.fieldProps.responsibilities}
            height={"auto"}
            label={"Responsibilities"}
        />
        <AbsoluteButton Control={({save}) => <Button
            type="primary"
            icon={mainProps.isEdit ? <SaveOutlined/> : <EditOutlined/>}
            onClick={async (e) => {
                if (mainProps.isEdit) {
                    await save(() => {
                        return mainProps.onClickSave(e)
                    })
                    mainProps.setView();
                } else {
                    mainProps.setEdit()
                }

            }}
        />}
        />
    </>;

};

export const MainPage = () => {

    return (
        <MenuTemplate
            heading={"Employer"}
            HeaderDropDown={() => {
                const {isLoading} = useEmployer()
                return !isLoading && <EmployerDropDown/>
            }}
            Main={() => {
                const {isLoading} = useEmployer()

                return !isLoading &&
                    <MainPageForm/>
            }}
        />
    );
};

export default MainPage
