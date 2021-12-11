import React from "react";
import About from "./lib/mdx/about.mdx";
import Link from "next/link";
import {routes} from "./routes";

export default () => {
    return (
        <div className={"page page-first-login"}>
            <header>
                <div>
                    <Link href={routes.home()}>
                        <a className={"primary"}>Continue</a>
                    </Link>
                </div>
            </header>
            <main>
                <section className={"info-about"}>
                    <About/>
                </section>
            </main>
            <footer/>
        </div>
    );
};
