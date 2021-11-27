import firebase from "firebase/compat/app";
import firebaseui from "firebaseui";
import {useState} from "react";
import {auth} from "../api/connect-api";

const ui = new firebaseui.auth.AuthUI(auth);

export const useAuthUI = () => {

    const [newUser, setNewUser] = useState(false);
    const [isLoggedIn, setLogin] = useState(false);

    auth.onAuthStateChanged(
        (user) => {
            if (user) {
                setLogin(true)
            }
        },
        (error) => {
            console.error(error);
        }
    );

    if (!ui.isPendingRedirect()) {
        ui.start("#firebaseui-auth-container", {
            callbacks: {
                signInSuccessWithAuthResult(authResult: any): boolean {
                    if (
                        authResult.additionalUserInfo.isNewUser
                    ) {
                        setNewUser(true)
                    }

                    return false;
                },
            },
            signInOptions: [
                // Leave the lines as is for the providers you want to offer
                // your users.
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
            ],
            signInFlow: "popup",
        });
    }

    return {newUser, isLoggedIn} as const
};

