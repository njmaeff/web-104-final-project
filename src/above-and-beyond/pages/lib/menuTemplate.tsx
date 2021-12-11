import React from "react";
import FullScreen from "./FullScreen";
import {EmployerProvider} from "../home/useEmployer";
import {EmployerDropDown} from "./control";
import Link from "next/link";
import {routes} from "../routes";
import {
    HomeOutlined,
    LikeOutlined,
    LineChartOutlined,
    SettingOutlined,
    StarOutlined
} from "@ant-design/icons";
import {RoleProvider} from "../home/useRole";
import {FooterControl, HeaderControl, Page} from "./page";

export const MenuTemplate: React.FC<{
    heading?: string;
    disableNavigation?: boolean;
}> = ({
          children,
          heading,
      }) => {

    return (
        <FullScreen>
            <Page>
                <EmployerProvider>
                    <header>
                        <nav>
                            <HeaderControl>
                                <h2>{heading}</h2>
                                <EmployerDropDown/>
                            </HeaderControl>
                            <Link href={routes.profile()}>
                                <a css={
                                    {
                                        fontSize: '2.5rem'
                                    }
                                }><SettingOutlined/></a>
                            </Link>
                        </nav>
                    </header>
                    <main>
                        <RoleProvider>
                            {children}
                        </RoleProvider>
                    </main>
                </EmployerProvider>
                <footer>
                    <nav>
                        <FooterControl position={'right'}>
                            <Link
                                href={routes.home()}
                            ><a><HomeOutlined/></a></Link>
                            <Link
                                href={routes.report()}
                            >
                                <a><LineChartOutlined/></a>
                            </Link>
                        </FooterControl>
                        <FooterControl position={'left'}>
                            <Link
                                href={routes.review()}
                            ><a><StarOutlined/></a></Link>
                            <Link
                                href={routes.rate()}
                            ><a><LikeOutlined/></a></Link>
                        </FooterControl>
                    </nav>
                </footer>
            </Page></FullScreen>
    );
};
