import {Page} from "../lib/types";
import {EmployerCollection, getEmployer} from "../lib/orm/docs";
import {mergeForms, useFormWithStatus} from "../lib/hooks/useFormWithStatus";
import {Employer, employerSchema, Role, roleSchema} from "../lib/orm/validate";
import React from "react";
import {MenuTemplate} from "../lib/page";
import {
    FieldDatePickerRow,
    FieldDropDownInput,
    FieldInputRow,
    FieldTable,
    TextInput
} from "../lib/input";
import {DropDownElement} from "../lib/control";
import {useEmployer} from "./useEmployer";
import {useRole} from "./useRole";
import {useAsync} from "../lib/hooks/useAsync";
import {FeatureButton} from "../lib/featureButton";
import styled from "@emotion/styled";

export const AbsoluteFeatureButton = styled(FeatureButton)`
    position: fixed;
    bottom: 1rem;
    left: 50%;
    transform: translate(-50%, 0);
    border-radius: 50%;
    z-index: 100;
`

export const MainPageForm = () => {
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
    }, [currentRoleID], {
        initialState: {
            name: "",
            startDate: new Date(),
            salary: "",
            skillTarget: "",
            salaryTarget: "",
            responsibilities: "",
        }

    });

    const allRoles = useAsync<Role[]>(async () => {
        if (currentEmployerID) {
            return await EmployerCollection.fromID(currentEmployerID).roles.readFromCollection();
        }

    }, [currentRoleID], {
        initialState: []
    });


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

    currentRole.onSuccess((result) => roleFormik.setValues(result))
    currentEmployer.onSuccess((result) => employerFormik.setValues(result))

    return <>
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
                <DropDownElement
                    key={'new'}
                    onClick={() => {
                    }}
                >
                    Create New
                </DropDownElement>

                {allRoles.result
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
        />
        <AbsoluteFeatureButton/>
    </>;

};

export const MainPage: Page = () => {

    return (
        <MenuTemplate heading={"Above and Beyond"}>
            <MainPageForm/>
        </MenuTemplate>
    );
};
