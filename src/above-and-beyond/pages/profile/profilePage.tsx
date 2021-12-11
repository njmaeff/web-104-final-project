import {User, userSchema} from "../lib/orm/validate";
import {PageStatus, useFormWithStatus} from "../lib/hooks/useFormWithStatus";
import {FieldInputRow, FieldTable} from "../lib/input";
import {AbsoluteFeatureButton} from "../lib/absoluteFeatureButton";
import React from "react";
import {auth} from "../lib/firebase/connect-api";
import {router} from "next/client";
import Link from "next/link";
import {routes} from "../routes";
import {Page} from "../lib/types";
import {MenuTemplate} from "../lib/page";

export const ProfileForm = () => {
    const user = auth.currentUser;

    const [form, {mainProps, ...userForm}] = useFormWithStatus<Partial<User>>(
        {
            initialValues: {
                displayName: user.displayName,
                email: user.email,
            },
            validationSchema: userSchema,
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

    return <>
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
                    router.push(routes.login())
                });
            }}
        >
            Logout
        </button>
        <Link href={routes.gettingStarted()}>
            <a className={"primary"}>
                About
            </a>
        </Link>
        <AbsoluteFeatureButton edit={mainProps.isEdit} valid={mainProps.isValid}
                               onClick={async () => {
                                   if (!mainProps.isEdit) {
                                       userForm.setEdit()
                                   } else if (mainProps.isEdit && mainProps.isValid) {
                                       mainProps.onClickSave();
                                       userForm.setView();
                                   }

                               }}/>
    </>;

}
export const ProfilePage: Page = () => {

    return (
        <MenuTemplate heading={"Profile"}>
            <ProfileForm/>
        </MenuTemplate>
    );
};
export default ProfilePage;
