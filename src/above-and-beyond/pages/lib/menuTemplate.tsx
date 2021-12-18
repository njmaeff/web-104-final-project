import React from "react";
import FullScreen from "./FullScreen";
import {EmployerProvider} from "../employer/useEmployer";
import Link from "next/link";
import {routes} from "../routes";
import {
    HomeOutlined,
    LikeOutlined,
    LineChartOutlined,
    SettingOutlined,
    StarOutlined
} from "@ant-design/icons";
import {RoleProvider} from "../employer/useRole";
import {FooterControl, HeaderControl, Page} from "./page";

export const MenuTemplate: React.FC<{
    heading?: string;
    HeaderDropDown?: React.ElementType
    Main?: React.ElementType
    disableNavigation?: boolean;
}> = ({
          children,
          heading,
          HeaderDropDown,
          Main,
      }) => {

    return (
        <FullScreen>
            <Page>
                <EmployerProvider>
                    <RoleProvider>
                        <header>
                            <nav>
                                <HeaderControl>
                                    <h2>{heading}</h2>
                                    {HeaderDropDown && <HeaderDropDown/>}
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
                            <Main/>
                        </main>
                    </RoleProvider>
                </EmployerProvider>
                <footer>
                    <nav>
                        <FooterControl position={'right'}>
                            <Link
                                href={routes.employer()}
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
