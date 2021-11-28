import React, {useState} from "react";
import {DropDown, DropDownElement} from "./control";
import {usePageCtx} from "../hooks/usePageCtx";
import {Loader} from "./loader";
import styled from "@emotion/styled";
import {ScrollBar} from "../styles/mixins";
import {Employer} from "../orm/validate";
import Link from "next/link";

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
        min-height: 5.5rem;
        padding: 1rem 0.75rem 0.75rem;

        nav {
            height: 100%;
            display: flex;
            align-items: center;
            border-radius: 30px;
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
          currentEmployer,
          heading,
          allEmployers,
          isValid,
          isEdit,
          onClickEdit,
          onClickSave,
          disableNavigation,
          editAllParams = {},
          isLoading,
      }) => {
    const [isSaving, setSaveState] = useState(false);
    const {api} = usePageCtx();

    return (
        <Page>
            <header>
                <nav>
                    <div className={"header-control"}>
                        <h2>{heading}</h2>
                        <DropDown
                            value={currentEmployer?.name}
                        >
                            <DropDownElement
                                href={`/`}
                                onClick={() => {
                                    api.newEmployer();
                                }}
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
                                        href={`/api?employer=${employer.id}`}
                                        onClick={() =>
                                            api.updateEmployer(employer.id)
                                        }
                                    >
                                        {employer.name}
                                    </DropDownElement>
                                ))}
                        </DropDown>
                    </div>
                    <Link href={"/profile"}>
                        <a className={'icon-settings'}/>
                    </Link>
                </nav>
            </header>
            {isSaving || isLoading ? (
                <main>
                    <Loader/>
                </main>
            ) : (
                <main>{children}</main>
            )}
            <footer>
                <nav>
                    <div className={`footer-control-feature`}>
                        <button
                            className={`icon-logo   ${
                                isEdit && isValid
                                    ? "border-highlight__success"
                                    : isEdit && !isValid
                                        ? "border-highlight__primary"
                                        : ""
                            }`}
                            type={"button"}
                            onClick={() => {
                                if (isEdit && isValid) {
                                    setSaveState(true);
                                    Promise.resolve(onClickSave?.())
                                        .then(() => {
                                            setSaveState(false);
                                        })
                                        .catch((e) => {
                                            setSaveState(false);
                                            throw e;
                                        });
                                } else if (!isEdit) {
                                    onClickEdit?.();
                                }
                            }}
                        />
                    </div>
                    <div className={"footer-control"}>
                        <Link
                            href={"/main"}
                        ><a className={'icon-home'}/></Link>
                        <Link
                            href={"/edit"}
                        >
                            <a className={'icon-edit'}/>
                        </Link>
                    </div>
                    <div className={"footer-control"}>
                        <Link
                            href={"/review"}
                        ><a className={'icon-review'}/></Link>
                        <Link
                            href={"/rate-success"}
                        ><a className={'icon-rate'}/></Link>
                    </div>
                </nav>
            </footer>
        </Page>
    );
};
