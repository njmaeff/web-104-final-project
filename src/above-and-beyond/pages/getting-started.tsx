import React from "react";
import About from "../lib/js/components/mdx/about.mdx";

export default () => {
    return (
        <div className={"page page-first-login"}>
            <header>
                <div>
                    <a href={"app.html"} className={"primary"}>
                        Continue
                    </a>
                </div>
            </header>
            <main>
                <section className={"info-about"}>
                    <About />
                </section>
            </main>
            <footer></footer>
        </div>
    );
};
