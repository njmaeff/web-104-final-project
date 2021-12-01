import {Page} from "../lib/types";
import {usePageCtx} from "../lib/hooks/usePageCtx";
import {EmployerCollection, useEmployer} from "../lib/orm/docs";
import {
    mergeForms,
    PageStatus,
    useFormWithStatus
} from "../lib/hooks/useFormWithStatus";
import {Employer, employerSchema, Role, roleSchema} from "../lib/orm/validate";
import {router} from "next/client";
import React, {Reducer, useEffect, useReducer} from "react";
import {useAsync} from "../lib/hooks/useAsync";
import {MenuTemplate} from "../lib/page";
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


export const MainPage: Page = () => {

    const {user} = usePageCtx();
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
                initialValues: {name: "", location: ""},
                validationSchema: employerSchema,
                onSubmit: async (values, helpers) => {
                    employerForm.setView();
                    helpers.setValues(values)
                    await router.push('index')
                    const ref = await employer.write(values);
                    await api.updateEmployer(ref.id);
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

    const [state, dispatch] = useReducer<Reducer<MainReducer, MainReducer>, MainReducer>((prevState, action) => {
        return {...prevState, ...action}
    }, {type: "init"}, arg => {
        const data = JSON.parse(localStorage.getItem(user.uid))
        if (data) {
            return {
                type: "view"
            };

        } else {
            return arg
        }
    });


    return (
        <MenuTemplate
            currentEmployer={
                isNewEmployer ? {name: "New Employer"} : currentEmployer
            }
            heading={"Above and Beyond"}
            allEmployers={allEmployers}
            disableNavigation={isNewRole}
            isLoading={!loaded}
            {...mainProps}
        >
            <FieldTable>
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
                    {!isNewEmployer && (
                        <DropDownElement
                            key={'new'}
                            onClick={() => {
                                api.newRole();
                            }}
                        >
                            Create New
                        </DropDownElement>
                    )}

                    {allRolesForEmployer
                        .filter((role) => role.id !== currentRoleID)
                        .map((role) => (
                            <DropDownElement
                                key={role.id}
                                onClick={() => api.updateRole(role.id)}
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
            />
        </MenuTemplate>
    );
};
