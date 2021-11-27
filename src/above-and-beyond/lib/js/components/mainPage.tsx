import React, { useEffect } from "react";
import {
    FieldDatePickerRow,
    FieldDropDownInput,
    FieldInputRow,
    FieldTable,
    TextInput,
} from "./input";
import { MenuTemplate } from "./page";
import { Page, PageProps } from "./types";
import {
    Employer,
    EmployerCollection,
    Role,
    useEmployer,
} from "../../orm/docs";
import {
    mergeForms,
    PageStatus,
    useFormWithStatus,
} from "../../hooks/useFormWithStatus";
import { DropDownElement } from "./control";
import { useAsync } from "../../hooks/useAsync";
import { usePageCtx } from "../../hooks/usePageCtx";

export const MainPage: Page<PageProps> = () => {
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

    const isNewEmployer = !currentEmployerID;
    const isNewRole = !currentRoleID || isNewEmployer;

    const employer = useEmployer();
    const [mainProps, [employerFormik, employerForm], [roleFormik, roleForm]] =
        mergeForms(
            useFormWithStatus<Partial<Employer>>({
                initialValues: currentEmployer,
                initialStatus: isNewEmployer
                    ? PageStatus.EDIT
                    : PageStatus.VIEW,
                onSubmit: async (values) => {
                    employerForm.setView();

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
                onSubmit: async (values) => {
                    roleForm.setView();
                    const ref = await EmployerCollection.fromID(
                        currentEmployerID
                    ).roles.write(values);
                    await api.updateRole(ref.id);
                },
            })
        );

    useEffect(() => {
        if (isNewEmployer) {
            employerFormik.setValues(currentEmployer);
            employerForm.setEdit();
            roleForm.setView();
        } else {
            employerForm.setView();
        }
    }, [currentEmployerID]);

    const [{ allRolesForEmployer }, { loaded }] = useAsync<{
        currentRole: Role;
        allRolesForEmployer: Role[];
    }>(
        async () => {
            if (!currentRoleID) {
                roleFormik.resetForm({ values: { ...emptyRole.currentRole } });
                if (!isNewEmployer) {
                    roleForm.setEdit();
                }
                return { ...emptyRole };
            } else {
                const role = EmployerCollection.fromID(currentEmployerID).roles;
                const allRolesForEmployer = await role.readFromCollection();
                const currentRole = await role.read(currentRoleID);
                await roleFormik.setValues(currentRole);

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
                isNewEmployer ? { name: "New Employer" } : currentEmployer
            }
            heading={"Above and Beyond"}
            allEmployers={allEmployers}
            disableNavigation={isNewRole}
            isLoading={!loaded}
            {...mainProps}
        >
            <FieldTable>
                <FieldInputRow
                    heading={"Organization Name"}
                    {...employerForm.fieldProps.name}
                />
                <FieldInputRow
                    heading={"Location"}
                    {...employerForm.fieldProps.location}
                />
            </FieldTable>
            <FieldTable>
                <FieldDropDownInput
                    heading={"Role"}
                    {...roleForm.fieldProps.name}
                >
                    {!isNewEmployer && (
                        <DropDownElement
                            href={`/api?role=`}
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
                                href={`/api?role=${role.id}`}
                                onClick={() => api.updateRole(role.id)}
                            >
                                {role.name}
                            </DropDownElement>
                        ))}
                </FieldDropDownInput>

                <FieldDatePickerRow
                    heading={"Start Date"}
                    {...roleForm.fieldProps.startDate}
                />
                <FieldInputRow
                    heading={"Current Salary"}
                    {...roleForm.fieldProps.salary}
                />
                <FieldInputRow
                    heading={"Target Salary"}
                    {...roleForm.fieldProps.salaryTarget}
                />
            </FieldTable>

            <TextInput
                {...roleForm.fieldProps.skillTarget}
                height={"auto"}
                heading={"Skills"}
            />

            <TextInput
                {...roleForm.fieldProps.responsibilities}
                height={"auto"}
                heading={"Responsibilities"}
            />
        </MenuTemplate>
    );
};
