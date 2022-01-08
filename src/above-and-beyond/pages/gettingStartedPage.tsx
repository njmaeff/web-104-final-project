import FullScreen from "./lib/layout/FullScreen";
import {Page} from "./lib/layout/page";
import Link from "next/link";
import {routes} from "./routes";
import {ButtonLink} from "./lib/link/buttonLink";
import {css} from "@emotion/react";
import About from "./lib/mdx/about.mdx";
import React from "react";

export const GettingStartedPage = () => {
    return (
        <FullScreen>
            <Page>
                <main>
                    <section css={css`
                        margin-top: 1rem;

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
                <footer>
                    <Link href={routes.home()}>
                        <ButtonLink css={
                            theme => css`
                                display: block;
                                max-width: 12rem;
                                margin: 1rem auto;
                                font-size: 1.5rem;
                                color: ${theme.colors.dark};
                                text-decoration: none;
                            `
                        }>Continue</ButtonLink>
                    </Link>
                </footer>
            </Page>
        </FullScreen>
    );
}

export default GettingStartedPage
