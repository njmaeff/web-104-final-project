import React, {useEffect} from "react";
import {
    FieldDatePickerRow,
    FieldDropDownInput,
    FieldInputRow,
    FieldTable,
    TextInput,
} from "./input";
import {MenuTemplate} from "./page";
import {Page} from "./types";
import {EmployerCollection, useEmployer,} from "../orm/docs";
import {
    mergeForms,
    PageStatus,
    useFormWithStatus,
} from "../hooks/useFormWithStatus";
import {DropDownElement} from "./control";
import {useAsync} from "../hooks/useAsync";
import {usePageCtx} from "../hooks/usePageCtx";
import {Employer, employerSchema, Role, roleSchema} from "../orm/validate";
import {router} from "next/client";


export const MainPage: Page<{ newEmployer?: boolean }> = ({
                                                              params: {newEmployer}
                                                          }) => {
    const {
        currentEmployerID,
        currentRoleID,
        allEmployers,
        currentEmployer,
        api,
    } = usePageCtx();


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

    const isNewEmployer = !!newEmployer;
    const isNewRole = !currentRoleID || isNewEmployer;

    const employer = useEmployer();
    const [mainProps, [employerFormik, employerForm], [roleFormik, roleForm]] =
        mergeForms(
            useFormWithStatus<Partial<Employer>>({
                initialValues: currentEmployer,
                initialStatus: isNewEmployer
                    ? PageStatus.EDIT
                    : PageStatus.VIEW,

                validationSchema: employerSchema,
                onSubmit: async (values, helpers) => {
                    employerForm.setView();
                    helpers.setValues(values)
                    await router.push('/main')
                    const ref = await employer.write(values);
                    await api.updateEmployer(ref.id);
                },
            }),
            useFormWithStatus<Partial<Role>>({
                initialValues: emptyRole.currentRole,
                initialStatus: isNewEmployer
                    ? PageStatus.VIEW
                    : isNewRole
                        ? PageStatus.EDIT
                        : PageStatus.VIEW,
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
