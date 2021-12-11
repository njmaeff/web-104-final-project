import React from "react";
import {EmployerDropDown} from "./control";
import styled from "@emotion/styled";
import {ScrollBar, withTablet} from "./styles/mixins";
import Link from "next/link";
import {css} from "@emotion/react";
import {
    HomeOutlined,
    LikeOutlined,
    LineChartOutlined,
    SettingOutlined,
    StarOutlined
} from "@ant-design/icons";
import {EmployerProvider} from "../home/useEmployer";
import {RoleProvider} from "../home/useRole";

export const Page = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;

    &::before {
        /* to add opacity on background only https://stackoverflow.com/a/10423121/15809514 */
        position: absolute;
        background-image: url("/img/mobile-login-background.png");
        background-position-y: 65%;
        background-position-x: 50%;
        background-repeat: no-repeat;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        opacity: .3;
        content: "";
        z-index: -1;
    }

    header {
        padding: 1rem;
        border-bottom: thin solid ${({theme}) => theme.colors.light};

        nav {
            display: flex;
            align-items: center;
            justify-content: space-between;

            a.icon-settings {
                margin: 0 0.25rem;
                font-size: 2.5rem;
                background-color: ${({theme}) => theme.colors.light};
                color: ${({theme}) => theme.colors.dark};
                text-decoration: none;
            }

        }
    }

    main {
        ${({theme}) => ScrollBar(theme)}

        display: flex;
        flex-direction: column;
        position: relative;
        height: 100%;
        padding: 1rem;

        overflow-y: scroll;

        .field-input, .field-display {
            margin-bottom: 2rem;
        }

        .input-text {
            margin: 1.5rem 0;
        }


    }

    footer {
        position: relative;
        min-height: 3.5rem;
        //padding-top: 1rem;

        nav {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: ${({theme}) => theme.colors.light};

            max-width: 28rem;
            margin: 0 auto;


            box-shadow: 0 0.25rem 0.5rem 0 ${({theme}) => theme.colors.dark};
            transition: 0.3s;
            /* On mouse-over, add a deeper shadow */

            &:hover {
                box-shadow: 0 0.5rem 1rem 0 ${({theme}) => theme.colors.dark};
            }

        }
    }
`

const ControlFeature = styled.div`
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);
    padding: 0.2rem 0;

    a {
        font-size: 2rem;
    }

`

const FooterControl = styled.div<{ position?: 'left' | 'right' }>`
    display: flex;
    justify-content: ${(props) => props.position === 'right' ? 'flex-end' : 'flex-start'};
    margin-left: ${(props) => props.position === 'left' && '2.5rem'};
    margin-right: ${(props) => props.position === 'right' && '2.5rem'};
    width: 100%;

    a {
        display: block;
        margin: 0 0.5rem;
        font-size: 1.5rem;
        padding: 0.5rem;
        border-radius: 30px;
    }

    ${({theme}) => withTablet(theme, css`
        :root {
            font-size: 1rem;
        }

        a {
            display: block;
            font-size: 2rem;
            padding: 0.5rem;

            border-radius: 30px;
        }
    `)}

`

export const HeaderControl = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 60%;

    h2 {
        margin: 0 0 0.5rem;
        font-size: 1rem;
        opacity: 70%;
        text-align: left;
        font-weight: lighter;
    }
`


export const MenuTemplate: React.FC<{
    heading?: string;
    disableNavigation?: boolean;
}> = ({
          children,
          heading,
      }) => {

    return (
        <Page>
            <EmployerProvider>
                <header>
                    <nav>
                        <HeaderControl>
                            <h2>{heading}</h2>
                            <EmployerDropDown/>
                        </HeaderControl>
                        <Link href={"/profile"}>
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
                            href={"/main"}
                        ><a><HomeOutlined/></a></Link>
                        <Link
                            href={"/analyze"}
                        >
                            <a><LineChartOutlined/></a>
                        </Link>
                    </FooterControl>
                    <FooterControl position={'left'}>
                        <Link
                            href={"/review"}
                        ><a><StarOutlined/></a></Link>
                        <Link
                            href={"/rate-success"}
                        ><a><LikeOutlined/></a></Link>
                    </FooterControl>
                </nav>
            </footer>
        </Page>
    );
};
