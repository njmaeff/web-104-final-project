import {Page} from "../lib/types";
import {EmployerCollection, useEmployer} from "../lib/orm/docs";
import {mergeForms, useFormWithStatus} from "../lib/hooks/useFormWithStatus";
import {Employer, employerSchema, Role, roleSchema} from "../lib/orm/validate";
import {router} from "next/client";
import React, {useEffect} from "react";
import {useAsync} from "../lib/hooks/useAsync";
import {MenuTemplate, page} from "../lib/page";
import {
    FieldDatePickerRow,
    FieldDropDownInput,
    FieldInputRow,
    FieldTable,
    TextInput
} from "../lib/input";
import {DropDownElement} from "../lib/control";

export type MainReducer = {
    type: "init"
} | {
    type: "new-employer"
} | {
    type: "new-role"
} | {
    type: "view"
} | {
    type: "edit"
}


export const MainPageForm = () => {
    const pageState = page.use()

    const emptyRole = {
        allRolesForEmployer: [],
        currentRole: {
            name: "",
            startDate: new Date(),
            salary: "",
            skillTarget: "",
            salaryTarget: "",
            responsibilities: "",
        },
    };


    const employer = useEmployer();

    const [mainProps, [employerFormik, employerForm], [roleFormik, roleForm]] =
        mergeForms(
            useFormWithStatus<Partial<Employer>>({
                initialValues: pageState.currentEmployer,
                validationSchema: employerSchema,
                onSubmit: async (values, helpers) => {
                    employerForm.setView();
                    helpers.setValues(values)
                    await router.push('index', '')
                    const ref = await employer.write(values);
                },
            }),
            useFormWithStatus<Partial<Role>>({
                initialValues: {
                    name: "",
                    startDate: new Date(),
                    salary: "",
                    skillTarget: "",
                    salaryTarget: "",
                    responsibilities: "",
                },
                validationSchema: roleSchema,
                onSubmit: async (values, helpers) => {
                    roleForm.setView();
                    helpers.setValues(values)
                    page.mergeState({

                    })
                    const ref = await EmployerCollection.fromID(
                        currentEmployerID
                    ).roles.write(values);

                    await api.updateRole(ref.id);
                },
            })
        );

    useEffect(() => {
        if (newEmployer) {
            employerFormik.setValues({
                name: "",
                location: ""
            });
            employerForm.setEdit();
            roleFormik.setValues(emptyRole.currentRole);
            roleForm.setView();
        }

    }, [newEmployer])


    const [{allRolesForEmployer}, {loaded}] = useAsync<{
        currentRole: Role;
        allRolesForEmployer: Role[];
    }>(
        async () => {
            if (!isNewRole && currentRoleID) {
                const role = EmployerCollection.fromID(currentEmployerID).roles;
                const allRolesForEmployer = await role.readFromCollection();
                const currentRole = await role.read(currentRoleID);
                await roleFormik.setValues(currentRole)

                return {
                    currentRole,
                    allRolesForEmployer,
                };
            }
        },
        {
            deps: [currentRoleID],
            init: emptyRole,
        }
    );

    return <> <FieldTable>
        <FieldInputRow
            label={"Organization Name"}
            {...employerForm.fieldProps.name}
        />
        <FieldInputRow
            label={"Location"}
            {...employerForm.fieldProps.location}
        />
    </FieldTable>
        <FieldTable>
            <FieldDropDownInput
                label={"Role"}
                {...roleForm.fieldProps.name}
            >
                <DropDownElement
                    key={'new'}
                    onClick={() => {
                    }}
                >
                    Create New
                </DropDownElement>

                {allRolesForEmployer
                    .filter((role) => role.id !== currentRoleID)
                    .map((role) => (
                        <DropDownElement
                            key={role.id}
                            onClick={() => {
                            }}
                        >
                            {role.name}
                        </DropDownElement>
                    ))}
            </FieldDropDownInput>

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
        </FieldTable>

        <TextInput
            {...roleForm.fieldProps.skillTarget}
            height={"auto"}
            label={"Skills"}
        />

        <TextInput
            {...roleForm.fieldProps.responsibilities}
            height={"auto"}
            label={"Responsibilities"}
        /></>

};

export const MainPage: Page = () => {


    return (
        <MenuTemplate
            heading={"Above and Beyond"}
        >
            <MainPageForm/>
        </MenuTemplate>
    );
};
