import {Button, Dropdown, Menu} from "antd";
import Link from "next/link";
import React, {ReactEventHandler} from "react";
import {css} from "@emotion/react";
import {DownOutlined} from "@ant-design/icons";
import {Loader} from "./loader";
import {Role} from "./orm/validate";
import {EmployerCollection} from "./orm/docs";
import {useEmployer} from "../employer/useEmployer";
import {useAsync} from "./hooks/useAsync";
import {useRouter} from "next/router";
import {routes} from "../routes";
import {useRole} from "../employer/useRole";

export const DropDownMenu: React.FC<{ value }> = ({children, value}) => {

    return <Dropdown css={theme => css`
        background-color: ${theme.colors.light};

    `} overlay={
        <Menu>{children}</Menu>
    }
                     trigger={['click']}>
        <Button css={theme =>
            css`
                display: block;
                border: 2px solid ${theme.colors.grayLight};
                padding-left: 0.5rem;
                color: ${theme.colors.dark};
                div {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    text-align: center;
                    max-width: 100%;
                    margin: 0;

                    p {
                        margin: 0 0.5rem 0 0;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
            `
        }>
            <div><p>{value}</p><DownOutlined/></div>
        </Button>
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
    return <DropDownMenu
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
    </DropDownMenu>

};


export const RoleDropDown: React.FC<{
    disableNew?: boolean
}> = ({
          disableNew
      }) => {
    const {
        currentEmployerID: employerID,
    } = useEmployer();
    const {
        currentRoleID: roleID,
        updateRole,
        newRole
    } = useRole()

    const {
        result: {role: currentRole, allRoles},
        isInProgress,
    } = useAsync<{ role: Role, allRoles: Role[] }>(async () => {
        const role = EmployerCollection.fromID(employerID).roles;
        const allRolesForEmployer = await role.readFromCollection();
        const currentRole = await role.read(roleID);
        return {
            role: currentRole,
            allRoles: allRolesForEmployer,
        };

    }, [employerID, roleID], {initialState: {}});

    return isInProgress ? <Loader/> : <DropDownMenu
        value={currentRole.name}
    >
        {!disableNew && <DropDownElement
            key={'new'}
            onClick={() => newRole()}
        >
            Create New
        </DropDownElement>}
        {allRoles
            .filter(
                (role) =>
                    role.id !== currentRole.id
            )
            .map((role) => (
                <DropDownElement
                    key={role.id}
                    onClick={() => updateRole(role.id)}
                >
                    {role.name}
                </DropDownElement>
            ))}
    </DropDownMenu>;
};

