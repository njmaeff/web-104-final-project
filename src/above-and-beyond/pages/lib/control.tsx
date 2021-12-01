import {Button, Dropdown, Menu} from "antd";
import Link from "next/link";
import React, {ReactEventHandler} from "react";
import {css} from "@emotion/react";
import {DownOutlined} from "@ant-design/icons";
import {Loader} from "./loader";
import {Employer, Role} from "./orm/validate";
import {useAsync} from "react-async-hook";
import {EmployerCollection, useEmployer, user} from "./orm/docs";

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


export const EmployerDropDown: React.FC<{
    onChange: (id: string) => void,
    onNew,
    onLoad: (employer: Employer) => void,
    onError?: (e: Error) => void,
    employerID: string
}> = ({onChange, onNew, onLoad, onError, employerID}) => {

    const {
        result: {currentEmployer, allEmployers},
        loading,
        error
    } = useAsync<{ currentEmployer: Employer, allEmployers: Employer[] }>(async () => {
        const currentEmployer = await useEmployer().read(employerID);
        const allEmployers = await useEmployer().readFromCollection();
        onLoad?.(currentEmployer)
        return {
            currentEmployer,
            allEmployers
        }
    }, [employerID]);

    error && onError?.(error)

    return loading ? <Loader/> : <DropDown
        value={currentEmployer.name}
    >
        <DropDownElement
            key={'new'}
            onClick={onNew}
        >
            Create New
        </DropDownElement>
        {allEmployers
            .filter(
                (employer) =>
                    employer.id !== currentEmployer.id
            )
            .map((employer) => (
                <DropDownElement
                    key={employer.id}
                    onClick={() => onChange?.(employer.id)}
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
        loading,
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

    return loading ? <Loader/> : <DropDown
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

