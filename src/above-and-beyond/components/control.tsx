import {Button, Dropdown, Menu} from "antd";
import Link from "next/link";
import React from "react";
import {css} from "@emotion/react";
import {DownOutlined} from "@ant-design/icons";

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
    href: string;
    onClick: () => any;
}> = ({href, onClick, children}) => {
    return (
        <Menu.Item>
            <Link
                href={href}
            >
                <a>{children}</a>
            </Link>
        </Menu.Item>
    );
};
