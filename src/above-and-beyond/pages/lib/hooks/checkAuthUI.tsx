import {useState} from "react";
import {auth} from "../firebase/connect-api";
import {client} from "./useHttpClient";

export const refreshToken = async () => {
    const result = await client.post("/api/login",);
    await auth.signInWithCustomToken(result.data.token)
};

export const checkAuthUI = () => {
    const [isLoggedIn, setLogin] = useState(null);

    auth.onAuthStateChanged(async (user) => {
            if (user) {
                if (!isLoggedIn) {
                    await refreshToken()
                }
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
