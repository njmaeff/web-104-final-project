import React from "react";
import {FieldInputRow, FieldTable} from "./input";
import {MenuTemplate} from "./page";
import {Page} from "./types";
import {PageStatus, useFormWithStatus} from "../hooks/useFormWithStatus";
import {auth} from "../firebase/connect-api";
import {usePageCtx} from "../hooks/usePageCtx";
import {router} from "next/client";
import Link from "next/link";
import {User} from "../orm/validate";

export const ProfilePage: Page = () => {
    const {currentEmployer, user, allEmployers} = usePageCtx();
    const [form, {mainProps, ...userForm}] = useFormWithStatus<Partial<User>>(
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

                form.resetForm({values, status: PageStatus.VIEW});
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
                    label={"Name"}
                    {...userForm.fieldProps.displayName}
                />
                <FieldInputRow
                    label={"Email"}
                    {...userForm.fieldProps.email}
                />
            </FieldTable>
            <button
                className={"primary"}
                onClick={() => {
                    auth.signOut().then(() => {
                        router.push('/')
                    });
                }}
            >
                Logout
            </button>
            <Link href={'/getting-started'}>
                <a className={"primary"}>
                    About
                </a>
            </Link>
        </MenuTemplate>
    );
};
