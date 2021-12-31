import FullScreen from "./lib/FullScreen";
import {Page} from "./lib/page";
import Link from "next/link";
import {routes} from "./routes";
import {PrimaryLink} from "./lib/link/primaryLink";
import {css} from "@emotion/react";
import About from "./lib/mdx/about.mdx";
import React from "react";

export const GettingStartedPage = () => {
    return (
        <FullScreen>
            <Page>
                <header>
                    <div>
                        <Link href={routes.home()}>
                            <PrimaryLink css={
                                css`
                                    display: block;
                                `
                            }>Continue</PrimaryLink>
                        </Link>
                    </div>
                </header>
                <main>
                    <section css={css`
                        padding-top: 2rem;

                        h1 {
                            text-align: left !important;
                            font-size: 2rem;
                        }

                        ul {
                            padding-left: 0.5rem;
                            font-size: 0.8rem;

                            p {
                                margin: 0.5rem 0;
                            }
                        }

                        a {
                            text-decoration: underline;
                        }

                        strong {
                            font-weight: bold;
                            //font-size: 1.2rem;
                        }

                    `}>
                        <About/>
                    </section>
                </main>
                <footer/>
            </Page>
        </FullScreen>
    );
}

export default GettingStartedPage
