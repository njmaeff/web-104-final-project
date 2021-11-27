import React from "react";
import { FieldInputRow, FieldTable } from "./input";
import { MenuTemplate } from "./page";
import { Page } from "./types";
import { PageStatus, useFormWithStatus } from "../../hooks/useFormWithStatus";
import { User } from "../../orm/docs";
import { auth } from "../../api/connect-api";
import { usePageCtx } from "../../hooks/usePageCtx";

export const ProfilePage: Page = () => {
    const { currentEmployer, user, allEmployers } = usePageCtx();
    const [form, { mainProps, ...userForm }] = useFormWithStatus<Partial<User>>(
        {
            initialValues: {
                displayName: user.displayName,
                email: user.email,
            },
            onSubmit: async (values) => {
                const user = auth.currentUser;

                if (values.displayName !== user.displayName) {
                    await user.updateProfile({
                        displayName: values.displayName,
                    });
                }
                if (values.email !== user.email) {
                    await user.updateEmail(values.email);
                }

                form.resetForm({ values, status: PageStatus.VIEW });
            },
        }
    );

    return (
        <MenuTemplate
            currentEmployer={currentEmployer}
            allEmployers={allEmployers}
            heading={"Profile"}
            {...mainProps}
        >
            <FieldTable>
                <FieldInputRow
                    heading={"Name"}
                    {...userForm.fieldProps.displayName}
                />
                <FieldInputRow
                    heading={"Email"}
                    {...userForm.fieldProps.email}
                />
            </FieldTable>
            <button
                className={"primary"}
                onClick={() => {
                    auth.signOut().then(() => {
                        window.location.href = "index.html";
                    });
                }}
            >
                Logout
            </button>
            <a href="getting-started.html" className={"primary"}>
                About
            </a>
        </MenuTemplate>
    );
};
