import {Button, Dropdown, Menu} from "antd";
import Link from "next/link";
import React, {ReactEventHandler} from "react";
import {css} from "@emotion/react";
import {DownOutlined} from "@ant-design/icons";
import {useEmployer} from "../../home/useEmployer";
import {useRole} from "../../home/useRole";
import {Employer, Role} from "../orm/validate";
import {useRouter} from "../../routes";
import {alphabetical} from "../util/sort";

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
    value: string
}> = ({href, value, children, onClick}) => {
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
            }}>{value}</a>}
            {children}
        </Menu.Item>
    );
};


export const EmployerDropDown: React.FC<{
    currentEmployer?: Employer
    allEmployers?: Employer[]
}> = ({
          currentEmployer, allEmployers,
      }) => {
    const router = useRouter()
    const {
        updateEmployer,
    } = useEmployer();
    return <DropDownMenu
        value={currentEmployer?.name}
    >
        <DropDownElement
            key={'new'}
            onClick={() => {
                router["home/new"].push({
                    query: {
                        menu: 'employer'
                    }
                })
            }}
            value={'Create New'}
        >
        </DropDownElement>
        {allEmployers?.filter(
            (employer) =>
                employer.id !== currentEmployer?.id
        )
            .sort(alphabetical).map((employer) => (
                <DropDownElement
                    key={employer.id}
                    onClick={() => {
                        updateEmployer(employer.id)
                    }}
                    value={employer.name}
                >
                </DropDownElement>
            ))}
    </DropDownMenu>

};


export const RoleDropDown: React.FC<{
    disableNew?: boolean
    currentRole?: Role
    allRoles?: Role[]
    onRemove?: (record: Role) => void
}> = ({
          currentRole,
          allRoles,
      }) => {

    const router = useRouter();
    const {
        updateRole,
    } = useRole()
    return <DropDownMenu
        value={currentRole?.name}
    >
        <DropDownElement
            key={'new'}
            onClick={() => {
                router["home/new"].push({
                    query: {
                        menu: 'role'
                    }
                })
            }}
            value={'Create New'}
        />
        {allRoles?.filter(
            (role) =>
                role.id !== currentRole?.id
        )
            .sort(alphabetical).map((role) => (
                <DropDownElement
                    key={role.id}
                    onClick={() => updateRole(role.id)}
                    value={role.name}
                >
                </DropDownElement>
            ))}
    </DropDownMenu>;
};

