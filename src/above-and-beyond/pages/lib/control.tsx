import {Button, Dropdown, Menu} from "antd";
import Link from "next/link";
import React, {ReactEventHandler} from "react";
import {css} from "@emotion/react";
import {DownOutlined} from "@ant-design/icons";
import {Loader} from "./loader";
import {Role} from "./orm/validate";
import {EmployerCollection, user} from "./orm/docs";
import {useEmployer} from "../employer/useEmployer";
import {useAsync} from "./hooks/useAsync";
import {useRouter} from "next/router";
import {routes} from "../routes";

export const DropDown: React.FC<{ value }> = ({children, value}) => {

    return <Dropdown css={theme => css`
        background-color: ${theme.colors.light};

    `} overlay={
        <Menu>{children}</Menu>
    }

                     trigger={['click']}>
        <Button css={theme =>
            css`
                border: 2px solid ${theme.colors.grayLight};
            `
        }>{value}<DownOutlined/></Button>
    </Dropdown>
};
export const DropDownElement: React.FC<{
    href?: string;
    onClick?: ReactEventHandler<HTMLAnchorElement>
}> = ({href, children, onClick}) => {
    return (
        <Menu.Item>
            {href ? <Link
                href={href}
            >
                <a onClick={(e) => {
                    onClick?.(e)
                }}>{children}</a>
            </Link> : <a onClick={(e) => {
                onClick?.(e)
            }}>{children}</a>}
        </Menu.Item>
    );
};


export const EmployerDropDown: React.FC<{}> = () => {

    const {
        currentEmployer,
        allEmployers,
        updateEmployer,
        newEmployer
    } = useEmployer();
    const router = useRouter();
    return <DropDown
        value={currentEmployer.result?.name ?? "New Employer"}
    >
        <DropDownElement
            key={'new'}
            onClick={() => {
                newEmployer()
                router.push(routes.employer({
                    query: {
                        action: 'new'
                    }
                }))
            }}
        >
            Create New
        </DropDownElement>
        {allEmployers.result?.filter(
            (employer) =>
                employer.id !== currentEmployer.result?.id
        )
            .map((employer) => (
                <DropDownElement
                    key={employer.id}
                    onClick={() => {
                        updateEmployer(employer.id)
                    }}
                >
                    {employer.name}
                </DropDownElement>
            ))}
    </DropDown>

};


export const RoleDropDown: React.FC<{
    onChange,
    onNew,
    onLoad,
    onError,
    employerID: string
    roleID: string
}> = ({onChange, onNew, onLoad, onError, employerID, roleID}) => {

    const {
        result: {role, allRoles},
        isLoading,
        error
    } = useAsync<{ role: Role, allRoles: Role[] }>(async () => {
        const role = EmployerCollection.fromID(employerID).roles;
        const allRolesForEmployer = await role.readFromCollection();
        const currentRole = await role.read(roleID);
        onLoad?.(currentRole)
        return {
            role: currentRole,
            allRoles: allRolesForEmployer,
        };

    }, [employerID, roleID]);


    error && onError?.(error)

    return isLoading ? <Loader/> : <DropDown
        value={role.name}
    >
        <DropDownElement
            key={'new'}
            onClick={onNew}
        >
            Create New
        </DropDownElement>
        {allRoles
            .filter(
                (role) =>
                    role.id !== role.id
            )
            .map((role) => (
                <DropDownElement
                    key={role.id}
                    onClick={async () => {
                        await user.write({
                            currentRoleID: role.id
                        })
                        onChange?.(role.id)
                    }}
                >
                    {role.name}
                </DropDownElement>
            ))}
    </DropDown>

};

