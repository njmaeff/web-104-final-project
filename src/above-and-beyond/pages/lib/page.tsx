import React, {SetStateAction, useContext, useState} from "react";
import {EmployerDropDown} from "./control";
import styled from "@emotion/styled";
import {Highlight, ScrollBar, withTablet} from "./styles/mixins";
import {Employer} from "./orm/validate";
import Link from "next/link";
import {Button} from "antd";
import {css} from "@emotion/react";
import {
    HomeOutlined,
    LikeOutlined,
    LineChartOutlined,
    PlusCircleOutlined,
    SettingOutlined,
    StarOutlined
} from "@ant-design/icons";
import {auth} from "./firebase/connect-api";

export const FeatureButton: React.FC<{ edit?: boolean, valid?: boolean, loading?: boolean, onClick }> = ({
                                                                                                             loading,
                                                                                                             onClick,
                                                                                                             edit,
                                                                                                             valid,
                                                                                                             ...props
                                                                                                         }) => {


    return <Button
        // className={'icon-logo'}
        css={theme => css`
            ${edit && valid ? Highlight(theme.colors.success) : edit && !valid ? Highlight(theme.colors.primary) : ""}
            display: block;
            background-color: ${theme.colors.primary} !important;
            color: ${theme.colors.light} !important;
            border: none;
            padding: 0.5rem;
            border-radius: 30px;
            width: 3.5rem;
            height: 3.5rem;

            span {
                padding: 0 !important;
                margin-top: -0.5rem !important;
            }

            p {
                font-size: 2rem;
                background-color: ${theme.colors.primary} !important;
                color: ${theme.colors.light} !important;
                margin: 0;
            }
        `}
        type="primary"
        loading={loading}
        onClick={onClick}
        {...props}>
        {/*<p className={!loading ? 'icon-logo' : ''}/>*/}
        <a><PlusCircleOutlined/></a>
    </Button>
};

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
        min-height: 4.5rem;
        padding-top: 1rem;

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

const FooterControlFeature = styled.div`
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);
    padding: 0.2rem 0;

    a {
        font-size: 2rem;
    }

`

const FooterControl = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 0 1.5rem;

    a {
        display: block;
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


export const DEFAULT_META = {
    currentEmployerID: "",
    currentRoleID: ""
};


export abstract class SyncContext<T extends {} = any, Status = undefined> {
    abstract initialize(): { state: T, status?: Status }

    use() {
        return useContext(this.context)
    }

    Provider: React.FC = ({children}) => {
        return <this.context.Provider value={{...this.state}}>
            {children}
        </this.context.Provider>
    }

    setState(value: T) {
        this._state[1](value)
    }

    mergeState(value: Partial<T>) {
        this._state[1]((prev) => ({...prev, ...value}))
    }

    setStatus(value: Status) {
        this.status = value
    }

    isStatus(value: Status) {
        return this.status === value
    }

    constructor() {
        const {state, status} = this.initialize()
        this._state = useState(state)
        this.context = React.createContext<T>(state);
        this.setStatus(status)
    }

    get state() {
        return this._state[0]
    }

    protected readonly context: React.Context<T>
    private status: Status
    private readonly _state: [T, React.Dispatch<SetStateAction<T>>]
}


export enum PageStatus {
    NewEmployer,
    View
}

export class PageData extends SyncContext<{ currentEmployerID: string, currentEmployer?: Employer }, PageStatus> {
    initialize() {
        const state = JSON.parse(localStorage.getItem(auth.currentUser.uid))
        return {
            state,
            status: state ? PageStatus.View : PageStatus.NewEmployer
        }
    }
}

const page = new PageData()

export const MenuTemplate: React.FC<{
    currentEmployer: Employer;
    allEmployers: Employer[];
    heading?: string;
    isEdit?: boolean;
    onClickEdit?;
    onClickSave?;
    isValid?: boolean;
    disableNavigation?: boolean;
    editAllParams?: any;
    isLoading?: boolean;
}> = ({
          children,
          heading,
          isValid,
          isEdit,
          onClickEdit,
          onClickSave,
          disableNavigation,
      }) => {

    return (
        <Page>
            <header>
                <nav>
                    <HeaderControl>
                        <h2>{heading}</h2>
                        <EmployerDropDown
                            onChange={(id) => page.setState({currentEmployerID: id})}
                            onNew={() => page.setStatus(PageStatus.NewEmployer)}
                            onLoad={(employer) => page.mergeState({currentEmployer: employer})}
                            employerID={page.state.currentEmployerID}/>
                    </HeaderControl>
                    <Link href={"/profile"}>
                        <a><SettingOutlined/></a>
                    </Link>
                </nav>
            </header>
            <main>
                <page.Provider>{children}</page.Provider>
            </main>
            <footer>
                <nav>
                    <FooterControlFeature>
                        <FeatureButton
                            onClick={(e) => {
                                e.preventDefault()
                                if (isEdit && isValid) {
                                    onClickSave?.()
                                } else if (!isEdit) {
                                    onClickEdit?.();
                                }
                            }}
                        />
                    </FooterControlFeature>
                    <FooterControl>
                        <Link
                            href={"/main"}
                        ><a><HomeOutlined/></a></Link>
                        <Link
                            href={"/analyze"}
                        >
                            <a><LineChartOutlined/></a>
                        </Link>
                    </FooterControl>
                    <FooterControl>
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
