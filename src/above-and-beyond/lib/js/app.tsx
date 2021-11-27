import React from "react";
import { render } from "react-dom";
import { auth } from "../api/connect-api";
import { Main } from "./components/app";

const initApp = () => {
    return new Promise((resolve, reject) => {
        auth.onAuthStateChanged(
            (user) => {
                if (!user) {
                    // User is signed out. Redirect to login
                    window.location.href = "/";
                }
                resolve(user);
            },
            (error) => {
                reject(error);
            }
        );
    });
};

window.addEventListener("load", function () {
    initApp()
        .then(() => render(<Main />, document.getElementById("root")))
        .catch((e) => console.error(e));
});
