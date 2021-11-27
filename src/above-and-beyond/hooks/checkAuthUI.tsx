import {useState} from "react";
import {auth} from "../api/connect-api";

export const checkAuthUI = () => {
    const [isLoggedIn, setLogin] = useState(null);

    auth.onAuthStateChanged(
        (user) => {
            if (user) {
                setLogin(true);
            } else {
                setLogin(false)
            }
        },
        (error) => {
            console.error(error);
        }
    );

    return {isLoggedIn}
};
