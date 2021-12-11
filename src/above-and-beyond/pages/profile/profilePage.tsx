import {User, userSchema} from "../lib/orm/validate";
import {PageStatus, useFormWithStatus} from "../lib/hooks/useFormWithStatus";
import {FieldInputRow, FieldTable} from "../lib/input";
import {AbsoluteFeatureButton} from "../lib/button/absoluteFeatureButton";
import React from "react";
import {auth} from "../lib/firebase/connect-api";
import {router} from "next/client";
import Link from "next/link";
import {routes} from "../routes";
import {Page} from "../lib/types";
import {PrimaryLink} from "../lib/link/primaryLink";
import {PrimaryButton} from "../lib/button/primaryButton";
import {MenuTemplate} from "../lib/menuTemplate";

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
        <PrimaryButton
            onClick={() => {
                auth.signOut().then(() => {
                    router.push(routes.login())
                });
            }}
        >
            Logout
        </PrimaryButton>
        <Link href={routes.gettingStarted()}>
            <PrimaryLink>
                About
            </PrimaryLink>
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
