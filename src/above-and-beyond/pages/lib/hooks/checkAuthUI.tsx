import {useState} from "react";
import {auth} from "../firebase/connect-api";

export const checkAuthUI = () => {
    const [isLoggedIn, setLogin] = useState(null);

    auth.onAuthStateChanged(async (user) => {
            if (user) {
                setLogin(true);
            } else {
                setLogin(false)
            }
        },
        (error) => {
            console.error(error);
        }
    )

    return {isLoggedIn}
};
