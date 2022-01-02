import {User, userSchema} from "../lib/orm/validate";
import {PageStatus, useFormWithStatus} from "../lib/hooks/useFormWithStatus";
import {FieldInputRow, FormTable} from "../lib/input/form";
import {AbsoluteButton} from "../lib/button/absoluteFeatureButton";
import React from "react";
import {auth} from "../lib/firebase/connect-api";
import Link from "next/link";
import {routes, useRouter} from "../routes";
import {NextPageWithLayout} from "../lib/types";
import {ButtonLink} from "../lib/link/buttonLink";
import {PrimaryButton} from "../lib/button/primaryButton";
import {MenuLayout} from "../lib/layout/menuLayout";
import {Button} from "antd";
import {EditOutlined, SaveOutlined} from "@ant-design/icons";

export const ProfileForm = () => {
    const user = auth.currentUser;
    const router = useRouter()
    const [form, mainProps] = useFormWithStatus<Partial<User>>(
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
        <FormTable>
            <FieldInputRow
                label={"Name"}
                {...mainProps.fieldProps.displayName}
            />
            <FieldInputRow
                label={"Email"}
                {...mainProps.fieldProps.email}
            />
        </FormTable>
        <PrimaryButton
            onClick={async () => {
                await auth.signOut()
                return router.login.push()
            }}
        >
            Logout
        </PrimaryButton>
        <Link href={routes.gettingStarted()}>
            <ButtonLink>
                About
            </ButtonLink>
        </Link>
        <AbsoluteButton Control={({save}) => <Button
            type="primary"
            icon={mainProps.isEdit ? <SaveOutlined/> : <EditOutlined/>}
            onClick={async () => {
                if (mainProps.isEdit) {
                    await save(() => mainProps.onClickSave());
                    mainProps.setView()

                } else {
                    mainProps.setEdit()
                }
            }}
        />
        }/>
    </>;

}
export const ProfilePage: NextPageWithLayout = () => {

    return (
        <MenuLayout heading={"Profile"} Main={ProfileForm}/>
    );
};
export default ProfilePage;
